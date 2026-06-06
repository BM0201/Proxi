/**
 * Módulo quick-tasks: Tareas rápidas.
 */
import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { QuickTasksController } from './quick-tasks.controller';
import { QuickTasksService } from './quick-tasks.service';

@Module({
  imports: [AuthModule],
  controllers: [QuickTasksController],
  providers: [QuickTasksService],
  exports: [QuickTasksService],
})
export class QuickTasksModule {}
