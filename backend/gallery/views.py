from django.shortcuts import render, get_object_or_404
from .models import Menu
from .models import Menu2food
from .models import Food

from .serializers import MenuSerializer, FoodSerializer, Menu2foodSerializer
from accounts.serializers import UserSerializer
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.http import HttpResponse
from django.core.files.base import ContentFile
# from PIL import Image

import base64
# from django.http import FileResponse
# Create your views here.
from keras.models import load_model
from keras.preprocessing import image
import cv2
import numpy as np
from matplotlib import pyplot as plt

import copy

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def getMenuInfo(request):
    def predict_img(bs64_data):
        # 이미지 변환해서 가져오기
        decoded_data = base64.b64decode(bs64_data)
        np_data = np.fromstring(decoded_data,np.uint8)
        img = cv2.imdecode(np_data,cv2.IMREAD_UNCHANGED)

        net = cv2.dnn.readNet("yolov4_19000.weights", "yolov4.cfg")
        classes = []
        with open("food30.names", "rt",encoding = "UTF8") as f:
            classes = [line.strip() for line in f.readlines()]
        layer_names = net.getLayerNames()
        output_layers = [layer_names[i[0] - 1]
                         for i in net.getUnconnectedOutLayers()]
        colors = np.random.uniform(0, 255, size=(len(classes), 3))

        # img_path = uri
        # img = cv2.imread(img_path)
        height, width, channels = img.shape

        blob = cv2.dnn.blobFromImage(
            img, 0.00392, (416, 416), (0, 0, 0), True, crop=True)  # 네트워크에 넣기 위한 전처리
        net.setInput(blob)  # 전처리된 blob 네트워크에 입력
        outs = net.forward(output_layers)  # 결과 받아오기

        class_ids = []
        confidences = []
        boxes = []
        for out in outs:
            for detection in out:
                scores = detection[5:]
                class_id = np.argmax(scores)
                confidence = scores[class_id]
                if confidence > 0.3:
                    # 탐지된 객체의 너비, 높이 및 중앙 좌표값 찾기
                    center_x = int(detection[0] * width)
                    center_y = int(detection[1] * height)
                    # print(center_x,center_y)
                    w = abs(int(detection[2] * width))
                    h = abs(int(detection[3] * height))
                    # print(w,h)
                    # 객체의 사각형 테두리 중 좌상단 좌표값 찾기
                    x = abs(int(center_x - w / 2))
                    y = abs(int(center_y - h / 2))
                    
                    nx = (x + w) / width
                    ny = (y + h) / height

                    if nx > 1:
                        nx = 1
                    if ny > 1:
                        ny =1
                    boxes.append([x/width, y/height, nx, ny])
                    confidences.append(float(confidence))
                    class_ids.append(class_id)
        # Non Maximum Suppression (겹쳐있는 박스 중 confidence 가 가장 높은 박스를 선택)
        #indexes = cv2.dnn.NMSBoxes(boxes, confidences, 0.3, 0.3)
        class_list = list(set(class_ids))
        idxx = []
        indexes=[]
        for i in range(len(class_list)):
            max_v=0
            for j in range(len(class_ids)):
                if class_ids[j] == class_list[i]:
                    if max_v < confidences[j]:
                        max_v = confidences[j]
                        idxx.append(j)
            indexes.append(idxx[len(idxx)-1])    
        # 최종적으로 indexes에 음식에 매치된 번호가 들어감 boxes에는 검출돤 하나의 음식에 대한 좌표
        font = cv2.FONT_HERSHEY_PLAIN
        det_foods = []
        for i in range(len(boxes)):  # 검출된 음식 개수만큼 돔
            if i in indexes:  # i에 검출된 음식 번호
                #x, y, w, h = boxes[i]
                class_name = classes[class_ids[i]]
                label = f"{class_name} {boxes[i]}"
                det_foods.append(label)
                # print(class_name) # 검출된 음식 이름 ex) pizza ..
                # print(confidences[i]) #검출된 확률
                color = colors[i]
                # 사각형 테두리 그리기 및 텍스트 쓰기
        # 리스트 형식으로 반환
        # 사진은 반환 어케?
        return det_foods  # 여기서 img는 사용자에게 뿌릴 이미지

    foodlist = predict_img(request.data['data'])
    # menu2food에 값넣기
    Foods_lst = []
    for i in range(len(foodlist)):
        idx = foodlist[i].find("[")
        food_obj = {}
        fname = foodlist[i][0:idx].strip()
        try:
            foods = get_object_or_404(Food, DESC_KOR=fname)
        except:
            foods = Food.objects.filter(DESC_KOR=fname)[0]
        locationStr = foodlist[i][idx:]
        location = list(map(float, locationStr[1:-1].split(',')))
        food_obj['location'] = location  # 좌표값
        food_obj['DESC_KOR'] = foods.DESC_KOR
        food_obj['SERVING_SIZE'] = foods.SERVING_SIZE
        food_obj['NUTR_CONT1'] = foods.NUTR_CONT1
        food_obj['NUTR_CONT2'] = foods.NUTR_CONT2
        food_obj['NUTR_CONT3'] = foods.NUTR_CONT3
        food_obj['NUTR_CONT4'] = foods.NUTR_CONT4
        food_obj['value'] = 1
        Foods_lst.append(food_obj)
    return Response(Foods_lst)

# @api_view(['POST'])
# @permission_classes([IsAuthenticated])
# def learnNewFood(request):
#     print(request)
#     #learncheck로 학습해야되는건지 아닌지 확인 가능(학습해야되면 true)
#     return Response('데이터 왔당')

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def saveMenu(request):
    # Menu에 값넣기
    new_menu = Menu()
    new_menu.user = request.user
    new_menu.mealTime = request.data['mealTime']
    new_menu.created_at = request.data['date']
    if request.data['data'] != 'none':
        # type, fileName, data << 각각 프론트에서 보낼 수 있는 데이터
        decoded_data = base64.b64decode(request.data['data'])
        new_menu.image = ContentFile(
            decoded_data, name=f"{request.data['fileName']}")  # url
    new_menu.save()  # insert
    foodName = request.data['foodName'][:-1].split(',')
    foodVal = request.data['foodVal'][:-1].split(',')
    learncheck = request.data['learnCheck'][:-1].split(',')
    foodLo = []
    if len(request.data['foodLo']) > 1:
        for lo in request.data['foodLo'][:-1].split('/'):
            if lo != '' :
                foodLo.append(list(map(float, lo[:-1].split(','))))
            else:
                foodLo.append([])
    # menu2food에 값넣기
    for i in range(len(foodName)):
        new_food = Menu2food()
        try:
            foods = get_object_or_404(Food, DESC_KOR=foodName[i])
        except:
            foods = Food.objects.filter(DESC_KOR=foodName[i])[0]
        # new_food.food 는 같은 이름 찾아서 넣어야댐
        if foodLo != []:
            new_food.location = foodLo[i]  # 좌표값
        new_food.image = new_menu
        new_food.food = foods
        new_food.value = int(foodVal[i])
        new_food.save()
        if learncheck[i] == 'True':
            file = open("data/"+foodName[i]+".txt", 'w')
            file.writelines(str(new_menu.image)+'\n')
            vstr = ""
            for a in foodLo[i]:
                vstr = vstr + str(a) + " "
            file.writelines(vstr)
            file.close()
    return Response("파일을 저장했습니다.")


@ api_view(['POST'])
@ permission_classes([IsAuthenticated])
def delImg(request, image_id):
    image = get_object_or_404(Menu, pk=image_id)
    if image.user == request.user or request.user.is_superuser:
        image.delete()
        return Response("이미지가 삭제되었습니다.")

# 내 사진 목록, 내 게시물 목록, 좋아하는 게시물 목록 처럼 사진만 나오는 경우 따로 api를 구현해야 할까?
# 일단 내 사진 목록에서 보여줄 용도로 하나 만들어보겠음



@ api_view(['POST'])
@ permission_classes([IsAuthenticated])
def myImgs(request):
    images = Menu.objects.order_by('-pk').filter(user=request.user)
    my_imgs = []
    for image in images:
        my_imgs.append(MenuSerializer(image).data)
    return Response(my_imgs)



def getImage(request, uri):
    images = []
    data = open('media/image/' + uri, "rb").read()
    images.append(data)
    return HttpResponse(images, content_type="image/png")


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getChart(request, date):
    Menus = Menu.objects.filter(user=request.user, created_at=date)
    Send = {'TotalCal': 0, 'Menus': {
        '아침': {}, '점심': {}, '저녁': {}, '간식': {}, '야식': {}, }}
    # Send = {'TotalCal' : 0, }
    # '아침': {meal:[menu2food_1, menu2food_2], nutrient: [탄,단,지]}
    time = ['아침', '점심', '저녁', '간식', '야식']
    for menu in Menus:
        for t in time:
            if menu.mealTime == t:
                menu2foods = Menu2food.objects.filter(image=menu)
                if 'meal' not in Send['Menus'][t]:
                    Send['Menus'][t]['meal'] = []
                T, D, G = 0, 0, 0
                for menu2food in menu2foods:
                    Send['Menus'][t]['meal'].append(
                        [menu2food.food.DESC_KOR, float(menu2food.food.NUTR_CONT1)*menu2food.value, menu2food.id, menu2food.value])
                    if menu2food.food.NUTR_CONT2:
                        T += float(menu2food.food.NUTR_CONT2)*menu2food.value
                    if menu2food.food.NUTR_CONT3:
                        D += float(menu2food.food.NUTR_CONT3)*menu2food.value
                    if menu2food.food.NUTR_CONT4:
                        G += float(menu2food.food.NUTR_CONT4)*menu2food.value
                    Send['TotalCal'] += float(menu2food.food.NUTR_CONT1) * \
                        menu2food.value
                total = T+D+G
                if T > 0:
                    Tper = (T/total)*100
                else:
                    Tper = 0
                if D > 0:
                    Dper = (D/total)*100
                else:
                    Dper = 0
                if G > 0:
                    Gper = (G/total)*100
                else:
                    Gper = 0
                Send['Menus'][t]['nutrient'] = [
                    Tper, Dper, Gper]
    return Response(Send)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def plusCnt(request):
    menu2food_id = request.data['menu2food_id']
    menu2food = get_object_or_404(
        Menu2food, id=menu2food_id)
    menu2food.value += 1
    menu2food.save()
    return Response('늘렸다')


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def minusCnt(request):
    menu2food_id = request.data['menu2food_id']
    menu2food = get_object_or_404(
        Menu2food, id=menu2food_id)
    menu2food.value -= 1
    menu2food.save()
    return Response('줄었다')


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def deleteMenu(request):
    menu2food_id = request.data['menu2food_id']
    del_Menu = get_object_or_404(
        Menu2food, id=menu2food_id)
    del_Menu.delete()
    return Response("식단이 삭제되었습니다.")


@ api_view(['GET'])
@ permission_classes([IsAuthenticated])
def getCalendar(request):
    Menus = Menu.objects.filter(user=request.user)
    MenusDict = {}
    for menu in Menus:
        target = str(menu.created_at)
        if target not in MenusDict.keys():
            # 아침, 점심, 저녁, 간식, 야식, 총칼로리
            MenusDict[target] = [0, 0, 0, 0, 0, 0]
        menu2foods = Menu2food.objects.filter(image=menu)
        tot = 0
        for menu2food in menu2foods:
            tot += float(menu2food.food.NUTR_CONT1) * menu2food.value
        if menu.mealTime == '아침':
            MenusDict[target][0] += tot
        elif menu.mealTime == '점심':
            MenusDict[target][1] += tot
        elif menu.mealTime == '저녁':
            MenusDict[target][2] += tot
        elif menu.mealTime == '간식':
            MenusDict[target][3] += tot
        elif menu.mealTime == '야식':
            MenusDict[target][4] += tot
        MenusDict[target][5] += tot
    return Response(MenusDict)


@api_view(['POST'])
def getFood(request, menu_id):
    menu = get_object_or_404(Menu, id=menu_id)
    menu2foods = Menu2food.objects.filter(image=menu)
    lst = []
    for menu2food in menu2foods:
        food = menu2food.food
        serializer = FoodSerializer(food)
        value = menu2food.value
        if menu2food.location != '[]':
            location = list(map(float, menu2food.location[1:-1].split(', ')))
        else:
            location = 'null'
        lst.append([serializer.data, value, location, menu2food.id])
    return Response(lst)


@api_view(['POST'])
def readFood(request, menu_id):
    menu = get_object_or_404(Menu, id=menu_id)
    menu2foods = Menu2food.objects.filter(image=menu)
    lst = dict()
    for menu2food in menu2foods:
        food = menu2food.food
        serializer = FoodSerializer(food)
        lst[serializer.data['DESC_KOR']] = []
    return Response(lst)


@api_view(['POST'])
def updateM2F(request, menu2food_id):
    menu2food = get_object_or_404(Menu2food, id=menu2food_id)
    new_food = get_object_or_404(Food, id=request.data['foodId'])
    up_menu2food = Menu2foodSerializer(menu2food, data=request.data)
    if up_menu2food.is_valid(raise_exception=True):
        up_menu2food.save(food=new_food)
        return Response(up_menu2food.data)