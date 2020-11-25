from django.shortcuts import render
from . import models
from django.contrib.auth import get_user_model
from . import serializers
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes

# Create your views here.
@api_view(['POST'])
def searchFood(request):
    def make_pi(N):
        m = len(N)
        pi = [0] * m        # 어느 지점에서 만들어지는 중복된 최장 문자열
        begin = 1
        matched = 0
        while begin + matched < m:      # begin + match => 검토하고자 하는 현재 위치
            if N[begin + matched] == N[matched]:
                matched += 1
                # 검토한 자리(begin + match)에 저장하고 싶은데 match가 이미 1 올랐으므로 begin + mathch - 1
                pi[begin + matched - 1] = matched
            else:
                if matched == 0:        # match 된 적이 없으면 begin만 + 1
                    begin += 1
                else:
                    # 검토할 자리를 얼마나 이동할 것인가? => 현재 매칭값 - 이전의 최장 길이
                    begin += matched - pi[matched - 1]
                    matched = pi[matched - 1]       # 현재 매칭값은 이전의 최장 중복 문자열로 이동
        return pi

    def kmp(sen, pat):
        n = len(sen)
        m = len(pat)
        pi = make_pi(pat)
        begin = 0
        matched = 0
        ans = 0
        while begin <= n - m:
            if matched < m and sen[begin + matched] == pat[matched]:
                matched += 1
                if matched == m:
                    return begin + 1
            else:
                if matched == 0:
                    begin += 1
                else:
                    begin += matched - pi[matched - 1]
                    matched = pi[matched - 1]
        return False

    pattern = request.data['search']
    Foods = models.Food.objects.filter(DESC_KOR__contains=pattern)
    lst = []
    for food in Foods:
        sentence = food.DESC_KOR
        res = kmp(sentence, pattern)
        if res:
            lst.append((res, pattern, food))

    lst.sort(key=lambda x: (x[0], x[1]))
    response = []  # (찾은 위치, 음식 이름, 음식 객체)
    for idx, name, food in lst[:10]:
        serializer = serializers.FoodSerializer(food)
        response.append(serializer.data)
    return Response(response)