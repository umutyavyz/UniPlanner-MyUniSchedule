'use client';

import { useEffect } from 'react';

interface NotificationManagerProps {
    lang?: 'tr' | 'en';
}

export function useNotifications(lang: 'tr' | 'en' = 'tr') {
    const requestPermission = async () => {
        if (!('Notification' in window)) {
            console.log('This browser does not support notifications');
            return false;
        }

        if (Notification.permission === 'granted') {
            return true;
        }

        if (Notification.permission !== 'denied') {
            const permission = await Notification.requestPermission();
            return permission === 'granted';
        }

        return false;
    };

    const sendNotification = (title: string, options?: NotificationOptions) => {
        if (Notification.permission === 'granted') {
            const notification = new Notification(title, {
                icon: '/icon-192x192.png',
                badge: '/icon-192x192.png',
                ...options
            });

            notification.onclick = () => {
                window.focus();
                notification.close();
            };

            return notification;
        }
        return null;
    };

    const scheduleExamReminder = (examName: string, date: Date) => {
        const now = new Date();
        const timeDiff = date.getTime() - now.getTime();
        const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

        // Remind 1 day before
        if (daysDiff === 1) {
            sendNotification(
                lang === 'tr' ? `Yarın Sınav: ${examName}` : `Exam Tomorrow: ${examName}`,
                {
                    body: lang === 'tr'
                        ? 'Sınava hazırlanmayı unutma!'
                        : "Don't forget to prepare!",
                    tag: `exam-${examName}`
                }
            );
        }

        // Remind on the day
        if (daysDiff === 0) {
            sendNotification(
                lang === 'tr' ? `Bugün Sınav: ${examName}` : `Exam Today: ${examName}`,
                {
                    body: lang === 'tr'
                        ? 'Sınav günü geldi, başarılar!'
                        : 'Exam day is here, good luck!',
                    tag: `exam-${examName}`,
                    requireInteraction: true
                }
            );
        }
    };

    const scheduleAssignmentReminder = (assignmentName: string, dueDate: Date) => {
        const now = new Date();
        const timeDiff = dueDate.getTime() - now.getTime();
        const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60));

        // Remind 24 hours before
        if (hoursDiff <= 24 && hoursDiff > 0) {
            sendNotification(
                lang === 'tr' ? `Ödev Teslimi Yaklaşıyor` : `Assignment Due Soon`,
                {
                    body: lang === 'tr'
                        ? `${assignmentName} için ${hoursDiff} saat kaldı!`
                        : `${hoursDiff} hours left for ${assignmentName}!`,
                    tag: `assignment-${assignmentName}`
                }
            );
        }
    };

    return {
        requestPermission,
        sendNotification,
        scheduleExamReminder,
        scheduleAssignmentReminder
    };
}

export default function NotificationManager({ lang = 'tr' }: NotificationManagerProps) {
    const { requestPermission } = useNotifications(lang);

    useEffect(() => {
        // Check if notifications are already enabled
        const hasAsked = localStorage.getItem('notifications-asked');

        if (!hasAsked && 'Notification' in window && Notification.permission === 'default') {
            // Wait a bit before asking
            const timer = setTimeout(() => {
                requestPermission();
                localStorage.setItem('notifications-asked', 'true');
            }, 30000); // Ask after 30 seconds

            return () => clearTimeout(timer);
        }
    }, []);

    return null; // This component doesn't render anything
}
