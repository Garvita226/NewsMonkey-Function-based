import React, { useEffect, useState } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component";


const News = (props) => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalResults, setTotalResults] = useState(0);
    

    const capitalize = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1)
    }


    const updateNews = async () => {
        props.setProgress(10)
        const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&pageSize=${props.pageSize}&page=${page}`;
        setLoading(true)
        props.setProgress(30)
        let data = await fetch(url);
        let parsedData = await data.json();
        props.setProgress(50)
        setArticles(parsedData.articles)
        setTotalResults(parsedData.totalResults)
        setLoading(false)

        props.setProgress(100)
    }

    useEffect(() => {
        document.title = `NewsMonkey - ${capitalize(props.category)}`
        updateNews()
    }, [])


    const fetchMoreData = async () => {
        setPage(page + 1)

        const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&pageSize=${props.pageSize}&page=${page + 1}`;
        setLoading(true)

        let data = await fetch(url);
        let parsedData = await data.json();
        setArticles(articles.concat(parsedData.articles))
        setTotalResults(parsedData.totalResults)
        setLoading(false)

    }

    // handlePrevClick = async () => {
    //     // console.log('Previous')
    // setPage(page - 1)
    //     
    //    updateNews()
    // }

    // handleNextClick = async () => {
    //     // console.log('Next')
    // setPage(page + 1)
    //     
    //     updateNews()
    // }


    return (
        <>
            <h1 className="text-center my-3">{`NewsMonkey - Top ${capitalize(props.category)} Headlines`}</h1>
            {loading && <Spinner />}

            <InfiniteScroll
                dataLength={articles.length}
                next={fetchMoreData}
                hasMore={articles.length !== totalResults}
                loader={loading && <Spinner />}
            >
                <div className="container my-2">
                    {<div className="row">
                        {articles.map((element) => {
                            return <div className="col-md-4" key={element.url}>
                                <NewsItem
                                    title={element.title ? element.title.slice(0, 45) : ''}
                                    description={element.description ? element.description.slice(0, 88) : ''}
                                    imageUrl={element.urlToImage ? element.urlToImage : 'https://beebom.com/wp-content/uploads/2023/06/Google-Pixel-7-Pro-in-Green-color-option-showcased-with-a-gray-background.jpg'}
                                    url={element.url}
                                    author={element.author ? element.author : 'Unknown'}
                                    date={element.publishedAt}
                                    source={element.source.name}
                                />
                            </div>
                        })}
                    </div>}
                </div>
            </InfiniteScroll>
            {/* <div className="d-flex justify-content-between">
                    <button type="button" disabled={this.state.page <= 1} className="btn btn-dark" onClick={this.handlePrevClick}>&larr; Previous</button>
                    <button type="button" disabled={this.state.page + 1 > Math.ceil(this.state.totalResults / props.pageSize)} className="btn btn-dark" onClick={this.handleNextClick}>Next &rarr; </button>
                </div> */}

        </>
    );

}

News.defaultProps = {
    pageSize: '9',
    country: 'in',
    category: 'general'
}

News.propTypes = {
    pageSize: PropTypes.number,
    country: PropTypes.string,
    category: PropTypes.string
}

export default News;


