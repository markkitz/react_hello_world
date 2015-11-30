const todo = (state, action) => {
	switch (action.type){
		case 'ADD_TODO':
		return {
			id:action.id,
			text:action.text,
			completed:false
		};
		case 'TOGGLE_TODO':
			if(state.id !== action.id) {
				return state;
			}
			return {
				...state, completed: !state.completed
			};
		default:
			return state;
	}
};
const todos = (state = [], action) => {
	switch (action.type) {
		case 'ADD_TODO': 
			return [ ...state, todo(undefined, action)];
		case 'REMOVE_TODO':
			console.log('remove todo' + action.id);

			var newState = state.filter( (todo) => { return todo.id != action.id;});

			console.log(newState);
			return newState;
		case 'TOGGLE_TODO': 
			return state.map(t => todo(t, action));
		default:
			return state;
	}	
};
const visibilityFilter  = (state ='SHOW_ALL', action) => 
	{
		switch (action.type) {
			case 'SET_VISIBILITY_FILTER' : 
				return action.filter; 
			default: 
				return state;
		}
	};
	
const user = (state = null, action) => 
{
	switch(action.type){
		case 'SET_USER':
			return action.user;
		default:
			return state;
	}
}

	
const { combineReducers} = Redux;
const todoApp = combineReducers({todos, visibilityFilter, user});
const {createStore} = Redux;
const store = createStore(todoApp);

const {Component } = React;
let nextTodoId = 0;
class TodoApp extends Component {
	render() {
		console.log("PROPS", this.props);
		return(
			<div>
				<button onClick={() => {
					store.dispatch({
						type: 'ADD_TODO',
						text: 'Text',
						id: nextTodoId++
					});
				}}>
				Add Todo 
				</button>
				<ul>
				{this.props.todos.map(todo=>
					<li key={todo.id} onClick={() => 
					{
						store.dispatch({type: 'REMOVE_TODO', id: todo.id});
					}}>
						{todo.text} {todo.id}
					</li>
				)}
				</ul>
				{this.props.user !=null? <p>{this.props.user.longName}</p>:'null'}			
				
				
			</div>
		)
	}
}

const render = () => {
	ReactDOM.render(
		<TodoApp todos={store.getState().todos} user={store.getState().user} />, document.getElementById('root')
	);	
};
store.subscribe(render);
store.dispatch({type:'ADD_TODO', text: 'First', id:nextTodoId++});
store.dispatch({type:'ADD_TODO', text: 'Second', id:nextTodoId++});
store.dispatch({type:'ADD_TODO', text: 'Third', id:nextTodoId++});
console.log('Current state:', store.getState());
console.log('----------SET_VISIBILITY_FILTER-----------');
store.dispatch({type:'SET_VISIBILITY_FILTER', filter:'SHOW_COMPLETED'});
console.log('Current state:', store.getState());
console.log('---------------------');
console.log('--------SET_USER-------------');
store.dispatch({type:'SET_USER', user:{userName:'markk', longName:'Mark Kitz'}});
console.log('Current state:', store.getState());
console.log('---------------------');
render();