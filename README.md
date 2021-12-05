cd '/c/Program Files/MongoDB/Server/5.0/bin'

./mongod.exe

https://github.com/ericr491/Top5Lists_HW4

# To-do
* None
# Notes
* forwardRef, pass a ref to a child component simple as that
* useImperativeHandle, takes a ref forwarded from a parent, and defines a collection of functions that it can access
* To handle an axios error, do so using a try ... catch block with in async function, to pass the error value to other functions that called this one, in the catch block either do throw **var_name** or return Promise.reject(**var_name**)
* useRef is an object with a single property **current**, and if that changes it does not cause a re-render like useState does.
* setState is async meaning you cannot call setState back to back, if using components use a callback, if using FC then use useEffect, but for reducers not sure could also just expand a CASE but probably not too ideal.
* Mate, really need Redux thunk so I can call two reducers back to back
* Render updates the vDom, it floats the changes to the actual dom afterwards
  * This whole process is called mounting
  * After the actual DOM changes it will call componentDidMount or useEffect
* useEffect always runs after render(), whether first mount or update