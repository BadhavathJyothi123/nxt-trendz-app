// Write your code here
import './index.css'

const SimilarProductItem = props => {
  const {productDetails} = props
  const {title, brand, imageUrl, rating, price} = productDetails

  return (
    <li className="similar-item">
      <img
        className="similR-image"
        alt={`similar product ${title}`}
        src={imageUrl}
      />
      <p className="similar-title">{title}</p>
      <p className="similar-title">by {brand}</p>
      <div className="similar-product-price-rating-container">
        <p className="similar-title"> Rs {price}/</p>
        <div className="rating-container">
          <p className="similar-title">{rating}</p>
          <img
            className="start-image"
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
          />
        </div>
      </div>
    </li>
  )
}

export default SimilarProductItem
