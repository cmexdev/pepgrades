import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import reportWebVitals from './reportWebVitals'
import firebase from 'firebase'

import './App.css'

import 'firebase/analytics'
import 'firebase/auth'
import 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyAjJP8cy2rSpea17FP8xe-EZHQ1oJmHJ4U",
  authDomain: "pepgrades.firebaseapp.com",
  projectId: "pepgrades",
  storageBucket: "pepgrades.appspot.com",
  messagingSenderId: "91418631176",
  appId: "1:91418631176:web:b5376e0542eafc812005bd",
  measurementId: "G-1C4BT7SVBL"
}

firebase.initializeApp(firebaseConfig)

const auth = firebase.auth()
const db = firebase.firestore()

const root = document.getElementById('root')

/* COMPONENTS */

class Login extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className={"login"}>
        <h1>Login</h1>
        <form>
          <label htmlFor={"Login-email"}>Please enter your email</label>
          <input type={"email"} id={"Login-email"} placeholder={"name@example.com"} name={"email"} />

          <label htmlFor={"Login-password"}>Password</label>
          <input type={"password"} id={"Login-password"} placeholder={"MyPassword"} name={"password"} />

          <a onClick={loginUser} id={"Login-Login"}>Login</a>
          <a href={"/signup"}>New here? Sign up</a>
        </form>
      </div>
    )
  }
}

class NotFound extends Component {
  render() {
    return (
      <div>
        <h1>Not found!
        <h3>Error 404</h3>
        </h1>
      </div>
    )
  }
}

class Loading extends Component {
  render() {
    return (
      <div className={"roboto"} style={{ textAlign: "center", fontWeight: 100 }}>
        <h1>PEP Gradebook</h1>
        <h3>Loading...</h3>
        <div className={"lds-ring"}><div></div><div></div><div></div><div></div></div>
        <p>Florida users may experience database delays.</p>
        <small>Why? Because the database was created and lives in <code>nam5 (us-central)</code> which is more ideal for the majority of the campuses.</small>
      </div>
    )
  }
}

class SignUp extends Component {
  render() {
    return (
      <div className={"signup"}>
        <h1>Sign up</h1>

        <form>
          <label htmlFor={"SignUp-type"}>Account type</label>
          <select id={"SignUp-type"}>
            <option value={"student"}>Student</option>
            <option value={"parent"}>Parent</option>
          </select>

          <label htmlFor={"SignUp-email"}>Email</label>
          <input id={"SignUp-email"} name={"email"} placeholder={"name@example.com"} type={"email"} />

          <label htmlFor={"SignUp-password"}>Password</label>
          <input id={"SignUp-password"} name={"password"} placeholder={"NotAStrongPassword"} type={"password"} />

          <label htmlFor={"SignUp-campus"}>Campus</label>
          <select id={"SignUp-campus"}>
            <option value={"milford"}>Milford, Ohio</option>
            <option value={"mason"}>Mason, Ohio</option>
          </select>

          <label htmlFor={"SignUp-first"}>First name</label>
          <input type={"text"} id={"SignUp-first"} placeholder={"Bob"} name={"firstname"}></input>

          <label htmlFor={"SignUp-last"}>Last name</label>
          <input type={"text"} id={"SignUp-last"} placeholder={"Jones"} name={"lastname"}></input>

          <a id={"SignUp-CreateAccount"} onClick={createUser}>Create your account</a>
          <a href={"/"}>Login</a>
        </form>
      </div>
    )
  }
}

class TutorCreation extends Component {
  render() {
    return (
      <div>
        <h1>Tutor account creation</h1>

        <form>
          <label htmlFor={"TutorCreation-first"}>First name</label>
          <input type={"text"} id={"TutorCreation-first"} name={"firstname"}></input>

          <label htmlFor={"TutorCreation-last"}>Last name</label>
          <input type={"text"} id={"TutorCreation-last"} name={"lastname"}></input>

          <label htmlFor={"TutorCreation-email"}>Email</label>
          <input type={"email"} id={"TutorCreation-email"} name={"email"}></input>

          <label htmlFor={"TutorCreation-password"}>Password</label>
          <input type={"password"} id={"TutorCreation-password"} name={"password"}></input>

          <p>Campuses you teach at</p>

          <input type={"checkbox"} id={"TutorCreation-campus-milford"}></input>
          <label htmlFor={"TutorCreation-campus-milford"}>Milford, Ohio</label>

          <input type={"checkbox"} id={"TutorCreation-campus-mason"}></input>
          <label htmlFor={"TutorCreation-campus-mason"}>Mason, Ohio</label>

          <a onClick={createTutor} id={"TutorCreation-Create"}>Create</a>
        </form>
      </div>
    )
  }
}

ReactDOM.render(
  <Loading />,
  root
)

document.title = 'PEP Gradebook'

function tick() {
  //define app as empty div
  var app = (
    <Loading />
  )

  //determine path/page
  const path = window.location.pathname
  if (path === '/') {
    window.location.pathname = '/login'
  }
  else if (path === '/login') {
    if (auth.currentUser) {
      window.location.pathname = '/home'
    }
    else {
      app = (
        <Login />
      )
    }
  }
  else if (path === '/signup') {
    app = (
      <SignUp />
    )
  }
  else if (path === '/home') {
    //get user type
    db.collection('users').doc(auth.currentUser.uid).get().then((doc) => {
      if (doc.exists) {
        if (doc.data().type === 'tutor') {

          db.collection("classes").where("operator", "==", auth.currentUser.uid).get().then((qs) => {
            let classArray = []
            qs.forEach(el => {
              //push to array
              var d = el.data()
              d.id = el.id
              classArray.push(d)
            })

            class HomeTutor extends Component {
              constructor(props) {
                super(props)
                this.state = {
                  classes: classArray
                }

              }

              renderTableData() {
                return this.state.classes.map((classdata, index) => {
                  const { name, operator, id } = classdata
                  return (
                    <tr key={name}>
                      <td>{name}</td>
                      <td>{operator}</td>
                      <td><a href={'/home/classes/manage?classId=' + id}>Manage</a></td>
                    </tr>
                  )
                })
              }

              render() {
                return (
                  <div>
                    <h1>Tutor homepage</h1>
                    <section>
                      <h3>Class management</h3>
                      <table id='classestable'>
                        <tbody>
                          {this.renderTableData()}
                        </tbody>
                      </table>
                      <a href={'/home/classes/new'}>Create a new class</a>
                    </section>
                    <section>
                      <h3>Account</h3>
                      <a href={'/home/account'}>Manage account</a>
                    </section>
                    <button onClick={signout}>Sign out</button>
                  </div>
                )
              }
            }

            ReactDOM.render(
              <HomeTutor />,
              root
            )
          })
        }
        else if (doc.data().type === 'parent') {
          //render parent homepage
        }
        else if (doc.data().type === 'student') {
          //render student homepage
          class HomeStudent extends Component {
            render() {
              return (
                <div>
                  <h1>Student homepage</h1>
                  <button onClick={signout}>Sign out</button>
                </div>
              )
            }
          }

          ReactDOM.render(
            <HomeStudent />, root
          )
        }
      }
    })

    if (document.getElementById('Home-LogOut')) {
      document.getElementById('Home-LogOut').addEventListener('click', function (e) {
        auth.signOut()
        window.location.pathname = '/'
      })
    }
  }
  else if (path === '/accountMakesApWP4fadJHUVAwO0iyL') {
    //tutor account creation link
    app = (
      <TutorCreation />
    )
  }
  else if (path === '/home/account') {
    app = (
      <div>
        <h1>Account</h1>
        <a href={'/home'}>Home</a>

        <h3>Welcome, {auth.currentUser.email}</h3>
      </div>
    )
  }
  else if (path === '/home/classes/manage') {
    var id = window.location.search.split('?classId=')[1]

    db.collection('classes').doc(id).get().then((doc) => {
      if (doc.exists && doc.data().operator === auth.currentUser.uid) {

        
        class StudentsInClass extends Component {
          constuctor(props) {
            super(props)
            this.state = {
            }
          }
        }

        //user ok to manage
        app = (
          <div>
            <h1>Manage: {id}</h1>
            <a href={'/home'}>Home</a>

            <h3>Manage students</h3>

          </div>
        )

        ReactDOM.render(app, root)
      }
    }).catch((err) => {
      app = (
        <div>
          <h1>Error!</h1>
          <h3>The class you're looking for does not exist!</h3>
        </div>
      )

      ReactDOM.render(app, root)
    })
  }
  else if (path === '/home/classes/new') {
    db.collection('users').doc(auth.currentUser.uid).get().then((doc) => {
      if (doc.exists) {
        if (doc.data().type === 'tutor') {

          class ClassCreation extends Component {
            render() {
              return (
                <div>
                  <h1>Create a new class</h1>

                  <form>
                    <label htmlFor={'ClassCreation-name'}>Class name</label>
                    <input type={'text'} placeholder={'American History'} id={'ClassCreation-name'}></input>

                    <label htmlFor={'ClassCreation-id'}>ID</label>
                    <input type={'text'} placeholder={'amhis (for american history)'} id={'ClassCreation-id'}></input>
                    <button id={'ClassCreation-guessId'}>Try to create a class ID</button>

                    <button onClick={createClass}>Create class</button>
                    <small>You can change the class name (it's a display name) but <b>not the ID</b>. Students don't have to interact with the ID, but it's good to keep it simple.</small>
                  </form>
                </div>
              )
            }
          }

          ReactDOM.render(<ClassCreation />, root)
        }
      }
    })
  }
  else {
    app = (
      <NotFound />
    )
  }

  ReactDOM.render(
    app,
    root
  )
}

reportWebVitals()

//do not use
//setInterval(tick, 2000)

//wait to seconds to render
//  - this gives time for auth system to work
setTimeout(tick, 2000)

/* DOM FUNCTIONS */

function createUser() {
  var email = document.getElementById('SignUp-email').value
  var password = document.getElementById('SignUp-password').value
  var type = document.getElementById('SignUp-type').value
  var campus = document.getElementById('SignUp-campus').value
  var first = document.getElementById('SignUp-first').value
  var last = document.getElementById('SignUp-last').value

  if (email && password && type && campus && first && last != '') {
    auth.createUserWithEmailAndPassword(email, password).then((user) => {
      createUserDoc(user.user.uid, type, campus, first, last)
    }).catch((err) => {
      console.error(err)
    })
  }
  else {
    //form is incomplete
    console.error('complete form first')
  }
}

function createUserDoc(uid, type, campus, first, last) {
  if (type === 'student') {
    db.collection('users').doc(uid).set({
      type: type,
      campus: campus,
      first: first,
      last: last,
      activated: false
    }).then(() => {
      console.log('wrote user doc')
      window.location.pathname = '/home'
    }).catch((err) => {
      console.error(err)
    })
  }
  else {
    db.collection('users').doc(uid).set({
      type: type,
      campus: campus,
      first: first,
      last: last
    }).then(() => {
      console.log('wrote user doc')
      window.location.pathname = '/home'
    }).catch((err) => {
      console.error(err)
    })
  }
}

function loginUser() {
  var email = document.getElementById('Login-email').value
  var password = document.getElementById('Login-password').value

  if (email && password != '') {
    auth.signInWithEmailAndPassword(email, password).then((user) => {
      window.location.pathname = '/home'
    }).catch((err) => {
      console.error(err)
    })
  }
}

function createTutor() {
  var first = document.getElementById('TutorCreation-first').value
  var last = document.getElementById('TutorCreation-last').value
  var email = document.getElementById('TutorCreation-email').value
  var password = document.getElementById('TutorCreation-password').value
  var campusArray = []
  if (document.getElementById('TutorCreation-campus-milford').checked === true) {
    campusArray.push('milford')
  }
  if (document.getElementById('TutorCreation-campus-mason').checked === true) {
    campusArray.push('mason')
  }

  if (first && last && email && password != '' && campusArray.length !== 0) {
    auth.createUserWithEmailAndPassword(email, password).then((user) => {
      createTutorDoc(user.user.uid, first, last, campusArray)
    }).catch((err) => {
      console.error(err)
    })
  }
}

function createTutorDoc(uid, first, last, campusArray) {
  db.collection('users').doc(uid).set({
    type: 'tutor',
    campuses: campusArray,
    first: first,
    last: last
  }).then((user) => {
    window.location.pathname = '/home'
  }).catch((err) => {
    console.error(err)
  })
}

function signout() {
  auth.signOut()
  //return /home rather / to avoid long loading
  window.location.pathname = '/login'
}

function createClass() {
  var name = document.getElementById('ClassCreation-name').value
  var id = document.getElementById('ClassCreation-id').value

  if (name && id != '') {
    db.collection('classes').doc(id).set({
      name: name,
      operator: auth.currentUser.uid
    }).then(() => {
      console.log('Created class')
      window.location.href = window.location.origin + '/home/classes/manage?classId=' + id
    })
  }
}