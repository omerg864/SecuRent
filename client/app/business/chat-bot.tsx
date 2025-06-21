'use client';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
} from 'react-native';
import { initBusinessAdvisor, chatBusinessAdvisor } from '@/services/businessService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { USER_ID } from '@/utils/asyncStorageConstants';

type Message = { role: 'user' | 'bot'; text: string };

export const ChatBot: React.FC = () => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [input, setInput] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const initializeChat = async () => {
      try {
        const businessId = await AsyncStorage.getItem(USER_ID);
        if (!businessId) {
          throw new Error('Business ID not found in AsyncStorage');
        }
        const { sessionId } = await initBusinessAdvisor(businessId);
        setSessionId(sessionId);
      } catch (err: any) {
        console.error('Error initializing chat:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    initializeChat();
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || !sessionId) return;
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    try {
      const { advisorReply } = await chatBusinessAdvisor(sessionId, userMsg);
      setMessages(prev => [...prev, { role: 'bot', text: advisorReply }]);
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  if (loading) {
    return (
      <View >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View >
        <Text>שגיאה: {error}</Text>
      </View>
    );
  }

  if (!sessionId) {
    return (
      <View >
        <Text>לא ניתן להתחבר לצ'אט.</Text>
      </View>
    );
  }

  return (
    <View >
        <Text> פה יהיה צ'אט מטריף</Text>
      </View>
  );
};
