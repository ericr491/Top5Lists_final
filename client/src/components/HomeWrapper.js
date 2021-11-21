import { useContext } from 'react'
import HomeScreen from './HomeScreen'
import SplashScreen from './SplashScreen'
import AuthContext from '../auth'

export default function HomeWrapper(props) {
    const { auth } = useContext(AuthContext)
    const { delModalToggleVisibility } = props
    console.log("HomeWrapper auth.loggedIn: " + auth.loggedIn)

    if (auth.loggedIn)
        return <HomeScreen delModalToggleVisibility={delModalToggleVisibility} />
    else
        return <SplashScreen />
}