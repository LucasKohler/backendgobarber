import { UpdateDateColumn } from "typeorm";

import { getRepository } from 'typeorm'
import User from '../models/user'
import path from 'path'
import uploadConfig from '../config/upload'
import AppError from  '../errors/AppError'


import fs from 'fs'

interface Request {
    user_id: string
    avatarFileName: string
}

class UpdateUserAvatarService {
    public async execute({ user_id, avatarFileName}: Request): Promise<User>{

        const usersRepository = getRepository(User)
        
        const user = await usersRepository.findOne(user_id)

        console.log(user)

        if(!user){
            throw new AppError('tOnly authenticated users can change avatar', 401)
        }

        if(user.avatar){
            const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar)

            const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath)

            if(userAvatarFileExists){
                await fs.promises.unlink(userAvatarFilePath)
            }
        }

        user.avatar = avatarFileName

        await usersRepository.save(user)

        return user

    }
    
}

export default UpdateUserAvatarService