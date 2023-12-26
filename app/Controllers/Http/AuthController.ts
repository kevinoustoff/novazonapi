// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import axios from 'axios'
import JWTService from 'App/Services/JWTService'
import FirebaseService from 'App/Services/FirebaseService'
import { doc, getDoc, collection , getDocs,updateDoc, orderBy, query} from 'firebase/firestore'
import Env from '@ioc:Adonis/Core/Env'

export default class AuthController {


}
