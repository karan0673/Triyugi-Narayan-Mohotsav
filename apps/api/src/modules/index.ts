import { ActivityModule } from './activity/activity.module';
import { AuthModule } from './auth/auth.module';
import { BudgetsModule } from './budgets/budgets.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { EventsModule } from './events/events.module';
import { ExpensesModule } from './expenses/expenses.module';
import { GuestsModule } from './guests/guests.module';
import { HealthModule } from './health/health.module';
import { InvitationsModule } from './invitations/invitations.module';
import { MediaModule } from './media/media.module';
import { MessagesModule } from './messages/messages.module';
import { NotificationsModule } from './notifications/notifications.module';
import { RemindersModule } from './reminders/reminders.module';
import { ShagunModule } from './shagun/shagun.module';
import { ShareLinksModule } from './share-links/share-links.module';
import { TasksModule } from './tasks/tasks.module';
import { TemplatesModule } from './templates/templates.module';
import { TimelineModule } from './timeline/timeline.module';
import { UsersModule } from './users/users.module';
import { VendorsModule } from './vendors/vendors.module';
import { WeddingModule } from './wedding/wedding.module';

export const FEATURE_MODULES = [
  HealthModule, AuthModule, UsersModule, WeddingModule, EventsModule, TasksModule,
  BudgetsModule, ExpensesModule, GuestsModule, InvitationsModule, MessagesModule,
  TemplatesModule, RemindersModule, MediaModule, ShareLinksModule, VendorsModule,
  TimelineModule, ShagunModule, DashboardModule, NotificationsModule, ActivityModule,
];
