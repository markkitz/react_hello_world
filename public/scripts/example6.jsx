"use scrict";
var json = [
  {category: "Sporting Goods", price: "$49.99", stocked: true, name: "Football"},
  {category: "Sporting Goods", price: "$9.99", stocked: true, name: "Baseball"},
  {category: "Sporting Goods", price: "$29.99", stocked: false, name: "Basketball"},
  {category: "Electronics", price: "$99.99", stocked: true, name: "iPod Touch"},
  {category: "Electronics", price: "$399.99", stocked: false, name: "iPhone 5"},
  {category: "Electronics", price: "$199.99", stocked: true, name: "Nexus 7"}
];

const ProductRow = React.createClass({
	render: function() {
		let name= this.props.name;
		if(this.props.stocked === false)
		{
			name = <span style={{color:'red'}}>{name}</span>;
		}
		return(<tr><td>{name}</td><td>{this.props.price}</td></tr>);
	}
});

const ProductCategoryRow = React.createClass({
	render: function() {
		return(<tr><td colSpan='2' style={{fontWeight:'bold'}}>{this.props.category}</td></tr>);
	}
});

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
		handleChange: function(){
			this.props.onUserInput(this.refs.filterTextInput.value, this.refs.inStockOnlyInput.checked);
		},
		render: function(){
			return( 
			<div>
				<input type='text' placeholder="Search ..." ref="filterTextInput" value={this.props.filterText} onChange={this.handleChange} />
				<div><input type='checkbox' ref="inStockOnlyInput" checked={this.props.inStockOnly}  onChange={this.handleChange}  /> only show products in stock</div>				
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
			this.setState({
				filterText:filterText,
				inStockOnly:inStockOnly
			});
		},
		handleAddItem: function(itemText) {
			json.push({category: "Electronics", price: "$199.99", stocked: true, name: itemText});
			this.forceUpdate();
		},
		render: function(){
			return(
				<div>
					<SearchBar filterText={this.state.filterText} inStockOnly={this.state.inStockOnly} onUserInput={this.handleUserInput} />
					<ProductTable products={this.props.products}  filterText={this.state.filterText} inStockOnly={this.state.inStockOnly}  />
					<AddItemForm onAddItem={this.handleAddItem} />
				</div>
			);
		}
	}	
);

ReactDOM.render(<FilteredProductTable products={json} />, document.getElementById('root'));
	