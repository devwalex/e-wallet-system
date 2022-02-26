const db = require('../config/db')
const bcrypt = require('bcryptjs')

/**
 * Create a new User
 * @param {Object} userData
 * @returns {Promise<User>}
 */

const createUser = async(userData) => {

    const {first_name, last_name, email, password } = userData

    const hashPassword = await bcrypt.hashSync(password, 10)

    const user = await db('users').insert( {first_name, last_name, email, password: hashPassword })
    console.log('user', user);

    return user
}

const findUserByEmail = async(email) => {
    const user = await db.select('*').from('users').where('email', email).first()
    console.log('user', user);
    return user
}



module.exports = {
    createUser,
    findUserByEmail
  };