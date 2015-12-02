"use scrict";
var json = [
  {category: "Sporting Goods", price: "$49.99", stocked: true, name: "Football"},
  {category: "Sporting Goods", price: "$9.99", stocked: true, name: "Baseball"},
  {category: "Sporting Goods", price: "$29.99", stocked: false, name: "Basketball"},
  {category: "Electronics", price: "$99.99", stocked: true, name: "iPod Touch"},
  {category: "Electronics", price: "$399.99", stocked: false, name: "iPhone 5"},
  {category: "Electronics", price: "$199.99", stocked: true, name: "Nexus 7"}
];

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



const ProductTable = React.createClass({
	render:function(){	
		
			var lastCategory = '';
			var rows = [];
			var key = 0;
			this.props.products.forEach(product =>	
			{
				if(product.name.indexOf(this.props.filterText) === -1 || (!product.stocked && this.props.inStockOnly))
				{
					return;
				}
				
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
});
const SearchBar = React.createClass(
	{
		handleChange:function() {
			
		},
		render: function(){
			console.log("search bar", this.props);
			return( 
			<div>
				<input type='text' value={this.props.searchFilter.filterText} onChange={this.handleChange} />
				<div><input type='checkbox' ref="inStockOnlyInput" checked={this.props.searchFilter.inStockOnly}  onChange={this.handleChange}  /> only show products in stock</div>				
			</div>);
		}
	}
);
const AddItemForm = React.createClass(
{
	handleAdd: function() {
		this.props.onAddItem(this.refs.itemTextInput.value);
		this.refs.itemTextInput.value = '';
	},
	render: function(){
		return (
			<div>
				
				<input type='text' ref="itemTextInput"  />
				<button onClick={this.handleAdd}>add</button>
			</div>
		);
	}
});

const FilteredProductTable = React.createClass(
	{
		getInitialState: function() {
        	return {
            filterText: '',
            inStockOnly: false
        	};
    	},
		handleUserInput: function(filterText, inStockOnly) {
			console.log('filter search');			
			store.dispatch({type:'SET_SEARCH_FILTER', filterText, inStockOnly});
		},
		handleAddItem: function(itemText) {
			json.push({category: "Electronics", price: "$199.99", stocked: true, name: itemText});
			this.forceUpdate();
		},
		render: function(){
			return(
				<div>
					<SearchBar searchFilter={this.props.searchFilter} onUserInput={this.handleUserInput} />
					<ProductTable products={this.props.products}  filterText={this.state.filterText} inStockOnly={this.state.inStockOnly}  />
					<AddItemForm onAddItem={this.handleAddItem} />
				</div>
			);
		}
	}	
);
////////////////////////////////////////////////////////////////
///////// REDUCERS /////////////////////////////////////////////
const searchFilter = (state = {filterText:'', inStockOnly:false}, action) => {
	switch(action.type){
		case 'SET_SEARCH_FILTER':
			console.log(action);
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
const products = (state = json, action) => {
	switch(action.type) {
		case 'ADD_PRODUCT':
			return [...state,  product(state, action)]; 
		default:
			return state;
	}
}


//const {combineReducers} = Redux;
//const productsApp = combineReducers({searchFilter});
const {createStore} = Redux;
const {combineReducers} = Redux;
const reducers = combineReducers({products, searchFilter});
console.log(reducers);
let store = createStore(reducers );

store.dispatch({type: 'ADD_PRODUCT', name:'test1', category:'Testers', price:'$99.99', inStock:true});
store.dispatch({type: 'ADD_PRODUCT', name:'test1', category:'Testers', price:'$99.99', inStock:true});
store.dispatch({type: 'SET_SEARCH_FILTER', filterText:'test', inStockOnly:true});
console.log(store.getState());



ReactDOM.render(
	
	<FilteredProductTable products={store.getState().products} searchFilter={store.getState().searchFilter} />, document.getElementById('root')
	
	);
	