import os
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .components.llm_connector import LlmConnector
from .serializers import NewChatSerializer, FollowupSerializer
from dotenv import load_dotenv

load_dotenv()

llm_api_key = os.getenv("OPENAI_API_KEY")


INTERNAL_SERVER_ERROR = Response(
    {"error": "Internal Server Error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
)


class NewChatView(APIView):

    def post(self, request, *args, **kwargs):
        serializer = NewChatSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        if not serializer or not serializer.validated_data:
            return INTERNAL_SERVER_ERROR

        question = serializer.validated_data["studentQuestion"]

        try:
            connector = LlmConnector(llm_api_key)
            response = connector.create_newchat(question)

            return Response(response, status=status.HTTP_200_OK)

        except ValueError as ve:
            return Response({"error": str(ve)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(e)
            return INTERNAL_SERVER_ERROR


class FollowupView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = FollowupSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        if not serializer or not serializer.validated_data:
            return INTERNAL_SERVER_ERROR

        question = serializer.validated_data["studentQuestion"]
        chat_history = serializer.validated_data["chatHistory"]

        try:
            connector = LlmConnector(llm_api_key)
            response_object = connector.create_followup(question, chat_history)

            return Response(response_object, status=status.HTTP_200_OK)

        except ValueError as ve:
            return Response({"error": str(ve)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return INTERNAL_SERVER_ERROR
