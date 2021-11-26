import './App.css'
import { React, useRef } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { AuthContextProvider } from './auth'
import { GlobalStoreContextProvider } from './store'
import {
    AppBanner,
    HomeWrapper,
    RegisterScreen,
    Statusbar,
    WorkspaceScreen,
    LoginScreen,
    ErrorModal,
    DeleteModal,
    ScreenWrapper,
    SplashScreen
} from './components'
/*
    This is our application's top-level component.
    
    @author McKilla Gorilla
*/
/*
  This is the entry-point for our application. Notice that we
  inject our store into all the components in our application.
  
  @author McKilla Gorilla
*/
const App = () => {
    const ref = useRef()
    const delRef = useRef()

    const toggleVisibility = () => {
        ref.current.toggleVisibility()
    }

    const displayMessage = (message) => {
        ref.current.setMessage(message)
    }

    const delModalToggleVisibility = () => {
        delRef.current.toggleVisibility()
    }

    return (
        <BrowserRouter>
            <AuthContextProvider>
                <GlobalStoreContextProvider>
                    <AppBanner />
                    <ErrorModal ref={ref} />
                    <DeleteModal ref={delRef} />
                    <Switch>
                        <Route
                            path="/"
                            exact
                            component={() => (
                                <SplashScreen />)}
                        />
                        <Route
                            path="/home/"
                            exact
                            component={() => (
                                <ScreenWrapper delModalToggleVisibility={delModalToggleVisibility} />)}
                        />
                        <Route
                            path="/register/"
                            exact
                            component={() => (
                                <RegisterScreen
                                    toggleVisibility={toggleVisibility}
                                    displayMessage={displayMessage} />)}
                        />
                        <Route
                            path="/login/"
                            exact
                            component={() => (
                                <LoginScreen
                                    toggleVisibility={toggleVisibility}
                                    displayMessage={displayMessage} />)}
                        />
                        <Route path="/top5list/:id" exact component={WorkspaceScreen} />
                    </Switch>
                </GlobalStoreContextProvider>
            </AuthContextProvider>
        </BrowserRouter>
    )
}

export default App