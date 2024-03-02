import { Controller, Post, Request, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";


@Controller('auth')
export class AuthController {
    @Post('login')
    @UseGuards(AuthGuard('local'))
    public async login(@Request() request) {
        return {
            message: 'Login successful',
            user: request.user,
            token : "token will be here"
        }
    }
}