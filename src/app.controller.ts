import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  //Dependency injection
  constructor(private readonly appService: AppService) {}

  // Get Route
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/:name')
  getHelloName(@Param('name') name: string): string {
    return this.appService.getHelloName(name);
  }
}
