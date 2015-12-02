"use scrict";
const {connect} = ReactRedux;

const ProductRow = ({name, price, stocked}) => {
	if(stocked === false)
	{
		name = <span style={{color:'red'}}>{name}</span>;
	}
	return(
		<tr><td>{name}</td><td>{price}</td></tr>
	);
}

const ProductCategoryRow = ({category}) => {
	return(<tr><td colSpan='2' style={{fontWeight:'bold'}}>{category}</td></tr>);	
}

const ProductTable = ({ products}) => {		
	var lastCategory = '';
	var rows = [];
	var key = 0;
	products.forEach(product =>	
	{
		
		if(lastCategory !== product.category)
		{
			rows.push(<ProductCategoryRow key={key++} category={product.category}  />);
			lastCategory = product.category;
		}
		rows.push( <ProductRow key={key++}  name={product.name} price={product.price} stocked={product.stocked}/>)			
	});
	return(
		<table>
			<thead><tr><th>Product</th><th>Price</th></tr></thead>
			<tbody>				
				{rows}
			</tbody>
		</table>);	
}


const SearchBar = connect(
	(state) => {
		return {filterText: state.searchFilter.filterText};
	},
	(dispatch) =>{
	return { handleChange: (filterText, inStockOnly) => dispatch({type: 'SET_SEARCH_FILTER', filterText, inStockOnly})	};
	}
)(({filterText, handleChange}) =>{
	let input;
	let checkbox;
	return( 
		<div>			
			<input type='text'  placeholder="Search ..." ref={node => {input = node; }} value={filterText} onChange={() => handleChange(input.value, checkbox.checked)}  />
			<div>
				<input type='checkbox' ref="inStockOnlyInput" ref={node => { checkbox = node; }} checked={searchFilter.inStockOnly} onChange={() => handleChange(input.value, checkbox.checked)} /> only show products in stock			
			</div>
		</div>
	);	
});

let AddItemForm = ({dispatch}) => {
	let input;
	return(
		
		<div style={{marginTop:'20px'}}> 				
 			<input type='text' ref={ node => { input = node;} } />
 			<button onClick={() => {
				 dispatch({type: 'ADD_PRODUCT', name:input.value, category:'Testers', price:'$99.99', 
				 stocked:true});
			 }} >add</button>
 		</div>
	);
}
AddItemForm = connect()(AddItemForm);

const getVisibleProducts = (products, searchFilter) =>{
	return  products.filter(product =>  (product.name.indexOf(searchFilter.filterText) === -1 || (!product.stocked && searchFilter.inStockOnly))=== false);
}
const VisibleProductList = connect(
	(state) =>{
		return { products: getVisibleProducts(state.products, state.searchFilter) };
	}
)(ProductTable);

const ProductsApp = () => {
	return ( 
	<div>
		<SearchBar/>
		<VisibleProductList  />	 	
		<AddItemForm />
	</div>
	);		
}


////////////////////////////////////////////////////////////////
///////// REDUCERS /////////////////////////////////////////////
const searchFilter = (state = {filterText:'', inStockOnly:false}, action) => {
	switch(action.type){
		case 'SET_SEARCH_FILTER':
			return { filterText: action.filterText, inStockOnly: action.inStockOnly};
		default:
			return state;
	}
}
let productId = 0;
const product = (state, action) => {
	switch(action.type) {
		case 'ADD_PRODUCT':
			return {id:productId++, ...action}; 
		default:
			return state;
	}
}


const products = (state = [], action) => {
	switch(action.type) {
		case 'ADD_PRODUCT':
			return [...state,  product(state, action)]; 
		default:
			return state;
	}
}
//const productsApp = combineReducers({searchFilter});
const {Provider} = ReactRedux;
const {createStore} = Redux;
const {combineReducers} = Redux;
const productsApp = combineReducers({products, searchFilter});

const intialState = {products:[
  {category: "Sporting Goods", price: "$49.99", stocked: true, name: "Football"},
  {category: "Sporting Goods", price: "$9.99", stocked: true, name: "Baseball"},
  {category: "Sporting Goods", price: "$29.99", stocked: false, name: "Basketball"},
  {category: "Electronics", price: "$99.99", stocked: true, name: "iPod Touch"},
  {category: "Electronics", price: "$399.99", stocked: false, name: "iPhone 5"},
  {category: "Electronics", price: "$199.99", stocked: true, name: "Nexus 7"}
], searchFilter:{filterText:'', inStockOnly:false}};


let store = createStore(productsApp, intialState);
console.log("INITAL", store.getState());

ReactDOM.render(		
	<Provider store={store}>
		<ProductsApp products={store.getState().products}  />
	</Provider>, document.getElementById('root')	);
	
