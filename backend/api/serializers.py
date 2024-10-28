from rest_framework import serializers


class NewChatSerializer(serializers.Serializer):
    studentQuestion = serializers.CharField()


class FollowupSerializer(serializers.Serializer):
    studentQuestion = serializers.CharField()
    chatHistory = serializers.JSONField()
