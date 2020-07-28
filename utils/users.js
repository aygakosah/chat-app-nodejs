const users =[]

//add User

const addUser =({id, username, room})=>{
    username=username.trim().toLowerCase()
    room=room.trim().toLowerCase()
    //Validate the data
    if(!username||!room){
        return{
            error:"Username and room are required"
        }
    }
    //check for existing user
    const existingUser =users.find((user)=>{
        return user.room==room&&user.username==username
    })
    if(existingUser){
        return {
            error:"User already exist"
        }
    }
    //Store user
    const user ={id, username, room }
    users.push(user)
    return {user}
}

const removeUser =(id)=>{
    const index =users.findIndex((user)=>user.id===id)
    if(index!==-1){
        return users.splice(index, 1)[0]
    }
}
const getUser =(id)=>{
    const user =users.find((user)=>user.id===id)
    if(!user){
        return {
            error:"User does not exist"
        }
    }
    return user
}

const getUsers =(room)=>{
    room =room.trim().toLowerCase()
    const user = users.filter((user)=>user.room==room)
    if(!user){
        return []
    }
    return user
}

module.exports={
    addUser,
    removeUser,
    getUser,
    getUsers
}
