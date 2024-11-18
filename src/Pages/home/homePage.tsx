import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Spinner from '../../components/spinner';
import InfiniteScroll from 'react-infinite-scroll-component';
import Header from '../../components/header';
import styled from 'styled-components';
import { AppDispatch, RootState } from '../../features/store';
import { fetchPosts, startLoading, stopLoading } from '../../features/post/postsSlice';
import Post from '../../components/post';

const HomePageContainer = styled.div`
    margin: 0 auto;
    padding: 16px;
`;

const HomePage: React.FC = () => {
const dispatch = useDispatch<AppDispatch>();
const posts = useSelector((state: RootState) => state.posts.posts);
const loading = useSelector((state: RootState) => state.posts.loading);
const [displayedPosts, setDisplayedPosts] = useState(posts.slice(0, 5)); // 초기 5개만
const [hasMore, setHasMore] = useState(true);

useEffect(() => {
    dispatch(fetchPosts());
}, [dispatch]);

useEffect(() => {
    if (!loading && posts.length > 0) {
        setDisplayedPosts(posts.slice(0, 5)); // 데이터가 있으면 초기 5개 설정
        setHasMore(true); // 추가 데이터가 있다고 가정
    }
}, [posts, loading]);

const fetchMorePosts = () => {
    const nextPosts = posts.slice(displayedPosts.length, displayedPosts.length + 5);
    if (nextPosts.length > 0) {
        setDisplayedPosts((prevPosts) => [...prevPosts, ...nextPosts]);
    } else {
        setHasMore(false); 
    }
};
console.log(displayedPosts)
return (
<HomePageContainer>
    {loading ? (
    <Spinner />
    ) : (
    <InfiniteScroll
        dataLength={displayedPosts.length}
        next={fetchMorePosts}
        hasMore={hasMore}
        loader={<Spinner />}
    >
        {displayedPosts.map((post) => (
        <Post
            _id={post._id}
            key={post._id}
            bookTitle={post.bookTitle}
            bookAuthor={post.bookAuthor}
            title={post.title}
            text={post.text}
            date={post.date}
            author={post.author}
            profilePhoto={post.profilePhoto}
            likes={post.likes}
            comments={post.comments}
        />
        ))}
    </InfiniteScroll>
    )}
</HomePageContainer>
);
};

export default HomePage;
