import React from "react";
import { Link } from "react-router-dom";

const Post = props => {
  const post = props.post;

  // gets the month, date & year in which the post was created
  const date = new Date(post.createdDate);
  // formats the date to output month/date/year
  const dateFormatted = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;

  return (
    <Link onClick={props.onClick} to={`/post/${post._id}`} className="list-group-item list-group-item-action">
      <img className="avatar-tiny" src={post.author.avatar} /> <strong>{post.title}</strong>{" "}
      <span className="text-muted small">
        {" "}
        {!props.noAuthor && <>by {post.author.username}</>} on {dateFormatted}{" "}
      </span>
    </Link>
  );
};

export default Post;
