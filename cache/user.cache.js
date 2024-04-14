import { redisClient } from "../config/redis.js";

export const setUserRedis = async(user)=>{
    try {
        const {_id, email,fname ,password,collectionStatus } = user;
        const redisUser = {
            _id,
            email,
            fname ,
            password,
            collectionStatus
        };
        const userHashkey = `userId-${_id}`
        redisClient.hmset(userHashkey,(redisUser)); 
    } catch (error) {
        
    }

} 

export const getUserRedis = async(_id)=>{
    try {
        const userHashkey = `userId-${_id}`
        const user = await redisClient.hget(userHashkey,"_id")
        return user
    } catch (error) {
        return null
    }
} 

export const deleteUserRedis = async(_id)=>{
    try {
        const userHashkey = `userId-${_id}`
        console.log(_id);

        const userDeleted = await redisClient.del(userHashkey);
        return userDeleted
    } catch (error) {
        return null
    }
} 
