import { supabase } from './supabase';

export interface ReminderPreferences {
  smsEnabled: boolean;
  emailEnabled: boolean;
  reminder24h: boolean;
  reminder2h: boolean;
  reminderStart: boolean;
  reminderTiming24h: string;
  reminderTiming2h: string;
}

export const saveReminderPreferences = async (
  userId: string,
  preferences: ReminderPreferences
) => {
  try {
    const { data, error } = await supabase
      .from('user_reminder_preferences')
      .upsert({
        user_id: userId,
        sms_enabled: preferences.smsEnabled,
        email_enabled: preferences.emailEnabled,
        reminder_24h_enabled: preferences.reminder24h,
        reminder_2h_enabled: preferences.reminder2h,
        reminder_starting_enabled: preferences.reminderStart,
        updated_at: new Date().toISOString()
      });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error saving reminder preferences:', error);
    return { success: false, error };
  }
};

export const getReminderPreferences = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('user_reminder_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching reminder preferences:', error);
    return { success: false, error };
  }
};

export const sendBookingReminder = async (
  bookingId: string,
  reminderType: '24_hours' | '2_hours' | 'starting_soon',
  recipientType: 'worker' | 'client'
) => {
  try {
    const { data, error } = await supabase.functions.invoke('send-booking-reminder', {
      body: { bookingId, reminderType, recipientType }
    });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error sending reminder:', error);
    return { success: false, error };
  }
};
