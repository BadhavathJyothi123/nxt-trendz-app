// Write your code here
import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {Link} from 'react-router-dom'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'

import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'INPROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    productData: {},
    similarProductsData: [],
    apiStatus: apiStatusConstants.initial,
    quantity: 1,
  }

  componentDidMount() {
    this.getProductsData()
  }

  formattedData = data => ({
    availability: data.availability,
    brand: data.brand,
    description: data.description,
    id: data.id,
    imageUrl: data.image_url,
    price: data.price,
    rating: data.rating,
    title: data.title,
    totalReviews: data.total_reviews,
  })

  getProductsData = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const featchedData = await response.json()
      const updatedData = this.formattedData(featchedData)
      const updatedSimilarProductsData = featchedData.similar_products.map(
        eachSimilar => this.formattedData(eachSimilar),
      )
      this.setState({
        productData: updatedData,
        similarProductsData: updatedSimilarProductsData,
        apiStatus: apiStatusConstants.success,
      })
    }
    if (response.status === 404) {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderLoaderView = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-container">
      <img
        className="failure-image"
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
      />
      <h1 className="failure-heading">Product Not Found</h1>
      <Link to="/products">
        <button className="btn" type="button">
          Continue Shopping
        </button>
      </Link>
    </div>
  )

  onDecrementQuantity = () => {
    const {quantity} = this.state
    if (quantity > 1) {
      this.setState(prevState => ({
        quantity: prevState.quantity - 1,
      }))
    }
  }

  onIncrementQunatity = () =>
    this.setState(prevState => ({
      quantity: prevState.quantity + 1,
    }))

  renderProductDetailsView = () => {
    const {productData, quantity, similarProductsData} = this.state
    const {
      availability,
      brand,
      description,
      imageUrl,
      price,
      rating,
      title,
      totalReviews,
    } = productData

    return (
      <div className="product-details-success-view-container">
        <div className="product-details-container">
          <img className="product-image" alt="product" src={imageUrl} />
          <div className="product">
            <h1 className="name">{title}</h1>
            <p className="price">Rs {price}/</p>
            <div className="rating-container">
              <p className="rating">{rating}</p>
              <img
                className="star-image"
                src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                alt="star"
              />
            </div>
            <p className="review">{totalReviews} Reviews</p>
          </div>
          <p className="product-descrption-container">{description}</p>
          <div className="label-value-container">
            <p className="label">Available:</p>
            <p className="label">{availability}</p>
          </div>
          <div className="brand-container">
            <p className="label">Brand:</p>
            <p className="label">{brand}</p>
          </div>
          <hr className="line" />

          <div className="quantity-container">
            {/* eslint-disable-next-line */}
            <button
              type="button"
              className="qun-btn"
              onClick={this.onDecrementQuantity}
              data-testid="minus"
            >
              <BsDashSquare className="quantity-icon" />
            </button>
            <p className="quantity">{quantity}</p>
            {/* eslint-disable-next-line */}
            <button
              className="qun-btn"
              type="button"
              onClick={this.onIncrementQunatity}
              data-testid="plus"
            >
              <BsPlusSquare className="quantity-icon" />
            </button>
          </div>
          <button type="button" className="add-btn">
            ADD TO CART
          </button>
        </div>
        <h1 className="similar-heading">Similar Products</h1>
        <ul className="similar-list">
          {similarProductsData.map(each => (
            <SimilarProductItem productDetails={each} key={each.id} />
          ))}
        </ul>
      </div>
    )
  }

  renderProductDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductDetailsView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoaderView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="product-item-details-container">
          {this.renderProductDetails()}
        </div>
      </>
    )
  }
}

export default ProductItemDetails
