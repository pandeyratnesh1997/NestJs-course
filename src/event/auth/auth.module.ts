import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { LocalStrategy } from "./local.strategy";
import { AuthController } from "./auth.controller";
import { JwtModule } from "@nestjs/jwt";
@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        // JwtModule.register({
        //     secret : "secret123",
        //     signOptions : { expiresIn : '1d'}
        // })
        JwtModule.registerAsync({
            useFactory: () => ({
                secret: "secret123",
                signOptions: { expiresIn: '1d' }
            })
        })
    ],
    controllers: [AuthController],
    providers: [LocalStrategy],
    exports: []
})
export class AuthModule { }