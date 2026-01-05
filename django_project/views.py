# views.py
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import csrf_protect
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.middleware.csrf import get_token
from django.http import JsonResponse
from google.cloud import bigquery

@api_view(['POST'])
@permission_classes([AllowAny])
@csrf_protect
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)  # sets the session cookie
        return Response({"username": user.username}, status=status.HTTP_200_OK)

    return Response({"detail": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def logout_view(request):
    logout(request)
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
def me_view(request):
    if request.user.is_authenticated:
        return Response({"username": request.user.username})
    return Response({"detail": "Not authenticated"}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
@permission_classes([AllowAny])
def csrf_view(request):
    # just by calling this, Django will set the csrftoken cookie
    get_token(request)
    return Response({"detail": "CSRF cookie set"})

@api_view(["GET"])
def get_data(request):
    if request.user.is_authenticated:
        client = bigquery.Client()   # <-- no credentials explicitly
        QUERY = "SELECT * FROM `lab-workflow-ex.lab_workflows_ds.df-output` LIMIT 1000"
        rows = client.query(QUERY).result()

        data = [
            {
                "sample_id": r[0],
                "run_id": r[1],
                "status": r[2],
                "read_count": int(r[3]),
                "created_at": r[4],
            }
            for r in rows
        ]

        return JsonResponse(data, safe=False)
    return Response({"detail": "Not authenticated"}, status=status.HTTP_401_UNAUTHORIZED)
