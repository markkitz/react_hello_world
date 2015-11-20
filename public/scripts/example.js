var CommentBox = React.createClass({
  render: function() {
    return (
      <div className="commentBox">
        <h1>Comments</h1>
        <p>Hello, world! I am a CommentBox.</p>
      </div>
    );
  }
});
ReactDOM.render(  
  <CommentBox />,
  document.getElementById('content')
);