import { useContext, useEffect } from 'react'
import AuthContext from '../auth'
import { GlobalStoreContext, ActiveViewType } from '../store'
import AllScreen from './AllScreen'
import UserScreen from './UserScreen'
import EditToolbar from './EditToolbar'
import HomeScreen from './HomeScreen'
import Statusbar from './Statusbar'

function ScreenWrapper(props) {
    const { delModalToggleVisibility } = props

    const { store } = useContext(GlobalStoreContext)
    const { auth } = useContext(AuthContext)

    useEffect(() => {
        store.loadIdNamePairs()
    }, [])


    let toolbar = <EditToolbar />
    let view = undefined

    switch (store.activeView) {
        case ActiveViewType.HOME:
        case ActiveViewType.EDIT:
            let idNamePairsHOME = store.idNamePairs.filter((pair) => pair.ownerName === auth.user?.username)
            if (store.searchBarContents !== "") {
                idNamePairsHOME = idNamePairsHOME.filter((pair) => pair.name.toLowerCase().startsWith(store.searchBarContents.toLowerCase()))
            }
            view = <HomeScreen
                idNamePairs={idNamePairsHOME}
                delModalToggleVisibility={delModalToggleVisibility} />
            break
        case ActiveViewType.ALL:
            let idNamePairsALL = store.idNamePairs.filter((pair) => pair.published && pair.ownerName !== undefined) // will not show the community lists
            if (store.searchBarContents !== "") {
                idNamePairsALL = idNamePairsALL.filter((pair) => pair.name.toLowerCase().startsWith(store.searchBarContents.toLowerCase()))
            }
            view = <AllScreen
                idNamePairs={idNamePairsALL}
                delModalToggleVisibility={delModalToggleVisibility} />
            break
        case ActiveViewType.USER:
            let idNamePairsUSER = store.idNamePairs
            if (store.searchBarContents !== "") {
                idNamePairsUSER = idNamePairsUSER
                    .filter((pair) => pair.published &&
                        pair.ownerName.toLowerCase()
                            .startsWith(store.searchBarContents.toLowerCase()))
            } else {
                idNamePairsUSER = []
            }
            view = <UserScreen
                idNamePairs={idNamePairsUSER}
                delModalToggleVisibility={delModalToggleVisibility} />
            break
        case ActiveViewType.COMMUNITY:
            break

        // case ActiveViewType.EDIT:
        //     break

        default:
            view = <></>
            break
    }

    return (
        <div>
            {toolbar}
            {view ? view : <></>}
            <Statusbar />
        </div>
    )

}

export default ScreenWrapper