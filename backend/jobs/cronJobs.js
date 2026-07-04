import cron from 'node-cron';
import User from '../models/User.js';
import { sendReminderEmail } from '../utils/emailService.js';

export const startCronJobs = () => {
  // Schedule tasks to be run on the server.
  // This runs every day at 09:00 AM
  cron.schedule('0 9 * * *', async () => {
    console.log('Running daily study reminder job...');
    try {
      // Find all users
      const users = await User.find({});
      
      for (const user of users) {
        if (user.email && user.name) {
          // Send email to each user
          // In a real app, you might want to throttle this or send in batches
          await sendReminderEmail(user.email, user.name);
        }
      }
      console.log('Daily study reminder job completed successfully.');
    } catch (error) {
      console.error('Error running daily study reminder job:', error);
    }
  });

  console.log('Cron jobs initialized successfully.');
};
