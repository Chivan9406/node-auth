import {CustomError, LoginUserDto, RegisterUserDto, UserEntity} from '../../domain'
import {UserModel} from '../../data'
import {bcryptAdapter, JwtAdapter} from '../../config'

export class AuthService {
    constructor() {
    }

    public async registerUser(registerUserDto: RegisterUserDto) {
        const existUser = await UserModel.findOne({email: registerUserDto.email})
        if (existUser) throw CustomError.badRequest('Email already exists')

        try {
            const user = new UserModel(registerUserDto)

            // Encriptar contrasena
            user.password = bcryptAdapter.hash(registerUserDto.password)

            await user.save()

            // JWT


            // Email de confirmacion


            const {password, ...userEntity} = UserEntity.fromObject(user)

            return {
                user: userEntity,
                token: 'ABC',
            }

        } catch (error) {
            throw CustomError.internalServer(`${error}`)
        }
    }

    public async loginUser(loginUserDto: LoginUserDto) {
        const user = await UserModel.findOne({email: loginUserDto.email})
        if (!user) throw CustomError.badRequest('Email not exists')

        const isMatch = bcryptAdapter.compare(loginUserDto.password, user.password)
        if (!isMatch) throw CustomError.badRequest('Password is not valid')

        const {password, ...userEntity} = UserEntity.fromObject(user)

        const token = await JwtAdapter.generateToken({id: user.id})
        if (!token) throw CustomError.internalServer('Error generating token')

        return {
            user: userEntity,
            token
        }
    }
}