const {Component} = React;
const {connect} = ReactRedux;

const  Todo = ({text, completed, onClick}) =>
{
	return(
		<li 
			style={{textDecoration: completed ? 'line-through':'none'}} 
			onClick={onClick}
			>{text}</li>
			);	
}
const  TodoList = ({onTodoClick,todos }) =>
{
	console.log(todos);
			return(
	<ul>
		{todos.map(todo => 
			<Todo 
				key = {todo.id} 
				{...todo} 
				onClick = { () => onTodoClick(todo.id)}
		 	/>
		 )}
	</ul>);	
}

let AddTodo = ({ dispatch}) =>
{
	let input;
	return(
		
		<div>
			<input type='text' ref= {node => 
				{ 
					input = node;
				}} />
				<button onClick={() =>				
					{
						dispatch({type:'ADD_TODO', text: input.value  });
						input.value = '';						
					}
					}
				>add</button>
		</div>);
}
AddTodo = connect()(AddTodo);

const Footer = () =>
{
	return(
		<p>
			Show: {' '}
			<FilterLink filter='SHOW_ALL'>All</FilterLink>			
			{' '}
			<FilterLink filter='SHOW_ACTIVE'>Active</FilterLink>
			{' '}
			<FilterLink filter='SHOW_COMPLETED'>Completed</FilterLink>
		</p>
	);
}

const Link = ({active, onClick, children}) => {
	
	if(active)
	{
		return <span>{children}</span>;
	}	
	return (
			<a href='#' onClick={e => {
		e.preventDefault();
		onClick();		
		}}>{children}</a>
	);
}



const mapStateToLinkProps = (state, ownProps) =>
{
	return {
		active: ownProps.filter === state.visibilityFilter
	};
}
const mapDispatchToLinkProps = (dispatch, ownProps) =>
{
	return {
		onClick: () => { dispatch({type:'SET_VISIBILITY_FILTER', filter: ownProps.filter});}
	};
}
const FilterLink = connect(mapStateToLinkProps, mapDispatchToLinkProps)(Link);

const getVisibleTodos = ( todos, filter) => {
	switch(filter)
	{
		case 'SHOW_ALL':
			return todos;
		case 'SHOW_COMPLETED':
			return todos.filter( t => t.completed);
		case 'SHOW_ACTIVE':
			return todos.filter(t => !t.completed);
	}
}


const mapTodoListStateToProps = (state) =>
{
	return { todos: getVisibleTodos(state.todos,state.visibilityFilter) };
}

const mapTodoListDispatchToProps = (dispatch) =>
{
	return { onTodoClick: (id) => dispatch({type:'TOGGLE_TODO', id})  };
}


const VisibleTodoList = connect(mapTodoListStateToProps, mapTodoListDispatchToProps)(TodoList);


const TodoApp = () => {
	return ( 
	<div>
		<AddTodo  />
		<VisibleTodoList  />
		<Footer />		 	
	</div>
	);		
}

const {Provider} = ReactRedux;


let todoid = 0;
const todos = (state = [], action) =>{
	switch(action.type){
		case 'ADD_TODO':
			return [...state, todo(undefined, action)];
		case 'TOGGLE_TODO':
			return state.map(t => todo(t, action)); 
		default:
			return state;
	}	
};
const todo = (state, action) => {
		switch(action.type){
		case 'ADD_TODO':
			return {id:todoid++, text:action.text, completed:false};
			
		case 'TOGGLE_TODO':
			if(action.id !== state.id)
				return state; 		
			return {...state, completed:!state.completed}
		default:
			return state;
		}
};

const visibilityFilter = (	state='SHOW_ALL',	action) => {
	switch(action.type)
	{
		case 'SET_VISIBILITY_FILTER':
			return action.filter;
		default: 
			return state;
	}	
};

const {combineReducers} = Redux;
const todoApp = combineReducers({todos, visibilityFilter});

ReactDOM.render(	<Provider store={Redux.createStore(todoApp)}>
						<TodoApp />
					</Provider>, 
					document.getElementById('root'));
