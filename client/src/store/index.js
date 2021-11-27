import { createContext, useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'
import api from '../api'
import AuthContext from '../auth'
/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers. 
    
    @author McKilla Gorilla
*/

// THIS IS THE CONTEXT WE'LL USE TO SHARE OUR STORE
export const GlobalStoreContext = createContext({})

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
    CREATE_NEW_LIST: "CREATE_NEW_LIST",
    LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
    CLOSE_CURRENT_EDITING_LIST: "CLOSE_CURRENT_EDITING_LIST",
    SET_CURRENT_EDITING_LIST: "SET_CURRENT_EDITING_LIST",
    MARK_LIST_FOR_DELETION: "MARK_LIST_FOR_DELETION",
    UNMARK_LIST_FOR_DELETION: "UNMARK_LIST_FOR_DELETION",
    SET_SEARCH_BAR_CONTENTS: "SET_SEARCH_BAR_CONTENTS",
    SET_TYPE_OF_VIEW_ACTIVE: "SET_TYPE_OF_VIEW_ACTIVE",
    SET_SORT_BY: "SET_SORT_BY",
    UPDATE_ITEMS_AND_COMMENTS: "UPDATE_ITEMS_AND_COMMENTS",
    UPDATE_VIEWS: "UPDATE_VIEWS",
    HANDLE_SAVE_AND_PUBLISH: "HANDLE_SAVE_AND_PUBLISH",
}

export const ActiveViewType = {
    HOME: "HOME",
    EDIT: "EDIT",
    COMMUNITY: "COMMUNITY",
    USER: "USER",
    ALL: "ALL",
}

export const SortByType = {
    NEW: "NEW",
    OLD: "OLD",
    MOST_LIKES: "MOST_LIKES",
    MOST_DISLIKES: "MOST_DISLIKES",
    MOST_VIEWS: "MOST_VIEWS",
}

// WE'LL NEED THIS TO PROCESS TRANSACTIONS


// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
function GlobalStoreContextProvider(props) {
    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        idNamePairs: [],
        idItemsComments: [],
        currentList: null, // ALIAS FOR editingList
        listMarkedForDeletion: null,
        activeView: ActiveViewType.HOME,
        sortBy: SortByType.NEW,
        searchBarContents: ""
    })
    const history = useHistory()

    // SINCE WE'VE WRAPPED THE STORE IN THE AUTH CONTEXT WE CAN ACCESS THE USER HERE
    const { auth } = useContext(AuthContext)

    function sortIdNamePairs(pairsArray, sortBy) {
        switch (sortBy) {
            case SortByType.OLD:
                return pairsArray.sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate))
            case SortByType.MOST_VIEWS:
                return pairsArray.sort((a, b) => b.views - a.views)
            case SortByType.MOST_LIKES:
                return pairsArray.sort((a, b) => b.likes.length - a.likes.length)
            case SortByType.MOST_DISLIKES:
                return pairsArray.sort((a, b) => b.dislikes.length - a.dislikes.length)
            case SortByType.NEW: // Newest is first
            default:
                return pairsArray.sort((a, b) => new Date(a.publishedDate) - new Date(b.publishedDate))
        }
    }

    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action) => {
        const { type, payload } = action
        switch (type) {
            // STOP EDITING THE CURRENT LIST
            case GlobalStoreActionType.HANDLE_SAVE_AND_PUBLISH: {
                let pairsArray = sortIdNamePairs(payload, store.sortBy)
                return setStore({
                    idNamePairs: pairsArray,
                    idItemsComments: store.idItemsComments,
                    currentList: null,
                    listMarkedForDeletion: null,
                    activeView: ActiveViewType.HOME,
                    sortBy: store.sortBy,
                    searchBarContents: store.searchBarContents
                })
            }

            case GlobalStoreActionType.CLOSE_CURRENT_EDITING_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    idItemsComments: store.idItemsComments,
                    currentList: null,
                    listMarkedForDeletion: null,
                    activeView: ActiveViewType.HOME,
                    sortBy: store.sortBy,
                    searchBarContents: store.searchBarContents
                })
            }
            case GlobalStoreActionType.UPDATE_ITEMS_AND_COMMENTS: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    idItemsComments: store.idItemsComments.filter(obj => obj._id !== payload._id).concat(payload),
                    currentList: null,
                    listMarkedForDeletion: null,
                    activeView: store.activeView,
                    sortBy: store.sortBy,
                    searchBarContents: store.searchBarContents
                })
            }
            // UPDATE A LIST
            case GlobalStoreActionType.SET_CURRENT_EDITING_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    idItemsComments: store.idItemsComments,
                    currentList: payload,
                    listMarkedForDeletion: null,
                    activeView: ActiveViewType.EDIT,
                    sortBy: store.sortBy,
                    searchBarContents: store.searchBarContents
                })
            }
            // CREATE A NEW LIST
            case GlobalStoreActionType.CREATE_NEW_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    idItemsComments: store.idItemsComments,
                    currentList: payload,
                    listMarkedForDeletion: null,
                    activeView: ActiveViewType.EDIT,
                    sortBy: store.sortBy,
                    searchBarContents: store.searchBarContents
                })
            }
            // GET ALL THE LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
                let pairsArray = sortIdNamePairs(payload, store.sortBy)
                // switch (store.sortBy) {
                //     case SortByType.OLD:
                //         pairsArray = pairsArray.sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate))
                //         break
                //     case SortByType.MOST_VIEWS:
                //         pairsArray = pairsArray.sort((a, b) => b.views - a.views)
                //         break
                //     case SortByType.MOST_LIKES:
                //         pairsArray = pairsArray.sort((a, b) => b.likes.length - a.likes.length)
                //         break
                //     case SortByType.MOST_DISLIKES:
                //         pairsArray = pairsArray.sort((a, b) => b.dislikes.length - a.dislikes.length)
                //         break
                //     case SortByType.NEW: // Newest is first
                //     default:
                //         pairsArray = pairsArray.sort((a, b) => new Date(a.publishedDate) - new Date(b.publishedDate))
                //         break
                // }
                return setStore({
                    idNamePairs: pairsArray,
                    idItemsComments: store.idItemsComments,
                    currentList: null,
                    listMarkedForDeletion: null,
                    activeView: store.activeView,
                    sortBy: store.sortBy,
                    searchBarContents: store.searchBarContents
                })
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    idItemsComments: store.idItemsComments,
                    currentList: null,
                    listMarkedForDeletion: payload,
                    activeView: store.activeView,
                    sortBy: store.sortBy,
                    searchBarContents: store.searchBarContents
                })
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.UNMARK_LIST_FOR_DELETION: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    idItemsComments: store.idItemsComments,
                    currentList: null,
                    listMarkedForDeletion: null,
                    activeView: store.activeView,
                    sortBy: store.sortBy,
                    searchBarContents: store.searchBarContents
                })
            }
            case GlobalStoreActionType.SET_SORT_BY: {
                return setStore({
                    idNamePairs: payload.pairsArray,
                    idItemsComments: store.idItemsComments,
                    currentList: null,
                    listMarkedForDeletion: null,
                    activeView: store.activeView,
                    sortBy: payload.sortType,
                    searchBarContents: store.searchBarContents
                })
            }
            case GlobalStoreActionType.SET_SEARCH_BAR_CONTENTS: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    idItemsComments: store.idItemsComments,
                    currentList: null,
                    listMarkedForDeletion: null,
                    activeView: store.activeView,
                    sortBy: store.sortBy,
                    searchBarContents: payload
                })
            }
            case GlobalStoreActionType.SET_TYPE_OF_VIEW_ACTIVE: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    idItemsComments: store.idItemsComments,
                    currentList: null,
                    listMarkedForDeletion: null,
                    activeView: payload,
                    sortBy: store.sortBy,
                    searchBarContents: "",
                    // searchBarContents: store.searchBarContents
                })
            }
            case GlobalStoreActionType.UPDATE_VIEWS: {
                let sortedPairs = sortIdNamePairs(payload.idNamePairs, store.sortBy)
                return setStore({
                    idNamePairs: sortedPairs,
                    idItemsComments: store.idItemsComments.filter(obj => obj._id !== payload._id).concat(payload.top5List),
                    currentList: null,
                    listMarkedForDeletion: null,
                    activeView: store.activeView,
                    sortBy: store.sortBy,
                    searchBarContents: "",
                })
            }
            default:
                return store
        }
    }



    // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
    // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN 
    // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.

    // THIS FUNCTION PROCESSES CHANGING A LIST NAME
    // store.changeListName = async function (id, newName) {
    //     let response = await api.getTop5ListById(id)
    //     if (response.data.success) {
    //         let top5List = response.data.top5List
    //         top5List.name = newName
    //         async function updateList(top5List) {
    //             response = await api.updateTop5ListById(top5List._id, top5List)
    //             if (response.data.success) {
    //                 async function getListPairs(top5List) {
    //                     response = await api.getTop5ListPairs()
    //                     if (response.data.success) {
    //                         let pairsArray = response.data.idNamePairs
    //                         storeReducer({
    //                             type: GlobalStoreActionType.CHANGE_LIST_NAME,
    //                             payload: {
    //                                 idNamePairs: pairsArray,
    //                                 top5List: top5List
    //                             }
    //                         })
    //                     }
    //                 }
    //                 getListPairs(top5List)
    //             }
    //         }
    //         updateList(top5List)
    //     }
    // }

    store.updateViewsCount = async function (id, newList) {
        let response = await api.unimportantUpdateTop5ListById(id, newList)
        if (response.data.success) {
            async function getListPairs(top5List) {
                response = await api.getTop5ListPairs()
                if (response.data.success) {
                    let pairsArray = response.data.idNamePairs
                    storeReducer({
                        type: GlobalStoreActionType.UPDATE_VIEWS,
                        payload: {
                            idNamePairs: pairsArray,
                            top5List: top5List
                        }
                    })
                }
            }
            getListPairs(newList)
        }
    }

    // THIS FUNCTION PROCESSES CLOSING THE CURRENTLY LOADED LIST
    store.closeCurrentList = function () {
        storeReducer({
            type: GlobalStoreActionType.CLOSE_CURRENT_EDITING_LIST,
            payload: {}
        })

        history.push("/home/")
    }

    // THIS FUNCTION CREATES A NEW LIST
    store.createNewList = async function (name = "Untitled", items = ['', '', '', '', ''], isPublished = false) {
        let payload = {
            name,
            items,
            ownerEmail: auth.user.email,
            ownerName: auth.user.username,
            likes: [],
            dislikes: [],
            views: 0,
            comments: [],
            published: isPublished
        }
        const response = await api.createTop5List(payload)
        if (response.data.success) {
            let newList = response.data.top5List
            storeReducer({
                type: GlobalStoreActionType.CREATE_NEW_LIST,
                payload: newList
            }
            )

            // IF IT'S A VALID LIST THEN LET'S START EDITING IT
            // history.push("/top5list/" + newList._id)
        }
        else {
            console.log("API FAILED TO CREATE A NEW LIST")
        }
    }

    // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE LISTS
    store.loadIdNamePairs = async function () {
        const response = await api.getTop5ListPairs()
        if (response.data.success) {
            let pairsArray = response.data.idNamePairs

            storeReducer({
                type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                payload: pairsArray
            })
        }
        else {
            console.log("API FAILED TO GET THE LIST PAIRS")
        }
    }

    // THE FOLLOWING 5 FUNCTIONS ARE FOR COORDINATING THE DELETION
    // OF A LIST, WHICH INCLUDES USING A VERIFICATION MODAL. THE
    // FUNCTIONS ARE markListForDeletion, deleteList, deleteMarkedList,
    // showDeleteListModal, and hideDeleteListModal
    store.markListForDeletion = async function (id) {
        // GET THE LIST
        let response = await api.getTop5ListById(id)
        if (response.data.success) {
            let top5List = response.data.top5List
            storeReducer({
                type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
                payload: top5List
            })
        }
    }

    store.deleteList = async function (listToDelete) {
        let response = await api.deleteTop5ListById(listToDelete._id)
        if (response.data.success) {
            store.loadIdNamePairs()
            // history.push("/home/")
        }
    }

    store.deleteMarkedList = function () {
        store.deleteList(store.listMarkedForDeletion)
    }

    store.unmarkListForDeletion = function () {
        storeReducer({
            type: GlobalStoreActionType.UNMARK_LIST_FOR_DELETION,
            payload: null
        })
    }

    // THE FOLLOWING 8 FUNCTIONS ARE FOR COORDINATING THE UPDATING
    // OF A LIST, WHICH INCLUDES DEALING WITH THE TRANSACTION STACK. THE
    // FUNCTIONS ARE setCurrentList, addMoveItemTransaction, addUpdateItemTransaction,
    // moveItem, updateItem, updateCurrentList, undo, and redo
    store.setCurrentList = async function (id) {
        let response = await api.getTop5ListById(id)
        if (response.data.success) {
            let top5List = response.data.top5List

            response = await api.updateTop5ListById(top5List._id, top5List)
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_EDITING_LIST,
                    payload: top5List
                })
            }
        }
    }


    store.updateCurrentList = async function (newTitle, newItems) {
        let updatedCurrentList = { ...store.currentList, name: newTitle, items: [...newItems] }

        const response = await api.updateTop5ListById(store.currentList._id, updatedCurrentList)
        if (response.data.success) {
            const response = await api.getTop5ListPairs()
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs

                storeReducer({
                    type: GlobalStoreActionType.HANDLE_SAVE_AND_PUBLISH,
                    payload: pairsArray
                })
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS")
            }
        }
    }

    store.setActiveView = function (view) {
        storeReducer({
            type: GlobalStoreActionType.SET_TYPE_OF_VIEW_ACTIVE,
            payload: view
        })
    }

    // Occurs when EXPAND is hit on ListCard and when user comments on a Post
    // For ListCard, if EXPAND is true, then it will try to find a matching id in this array on in the store
    store.updateItemsAndComments = async function (id) {
        const response = await api.getTop5ListById(id)
        if (response.data.success) {
            let top5List = response.data.top5List
            storeReducer({
                type: GlobalStoreActionType.UPDATE_ITEMS_AND_COMMENTS,
                payload: top5List
            })
        }
    }


    // When a user comments on a Post a simple concat is needed
    store.postAComment = async function (id, comment) {
        const response = await api.postComment({ top5ListId: id, comment })
        if (response.data.success) {
            await store.updateItemsAndComments(id)
        }
    }

    // Used for likes/dislikes so far
    store.updateTop5List = async function (id, newList) {
        const response = await api.unimportantUpdateTop5ListById(id, newList)
        if (response.data.success) {
            await store.loadIdNamePairs()
        }
    }


    store.setSearchBarContents = function (newContents) {
        storeReducer({
            type: GlobalStoreActionType.SET_SEARCH_BAR_CONTENTS,
            payload: newContents
        })
    }

    store.setSortType = function (sortType) {
        let pairsArray = sortIdNamePairs(store.idNamePairs, sortType)
        // switch (sortType) {
        //     case SortByType.OLD:
        //         pairsArray = pairsArray.sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate))
        //         break
        //     case SortByType.MOST_VIEWS:
        //         pairsArray = pairsArray.sort((a, b) => b.views - a.views)
        //         break
        //     case SortByType.MOST_LIKES:
        //         pairsArray = pairsArray.sort((a, b) => b.likes.length - a.likes.length)
        //         break
        //     case SortByType.MOST_DISLIKES:
        //         pairsArray = pairsArray.sort((a, b) => b.dislikes.length - a.dislikes.length)
        //         break
        //     case SortByType.NEW: // Newest is first
        //     default:
        //         pairsArray = pairsArray.sort((a, b) => new Date(a.publishedDate) - new Date(b.publishedDate))
        //         break
        // }
        storeReducer({
            type: GlobalStoreActionType.SET_SORT_BY,
            payload: { sortType, pairsArray }
        })
    }

    // store.logout = function () {
    //     storeReducer({

    //     })
    // }

    return (
        <GlobalStoreContext.Provider value={{
            store
        }}>
            {props.children}
        </GlobalStoreContext.Provider>
    )
}

export default GlobalStoreContext
export { GlobalStoreContextProvider }