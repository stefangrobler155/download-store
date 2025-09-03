import { useEffect, useState } from 'react';
import { getProducts } from '../utils/api';
import { useCart } from '../context/CardCon';

export default function ProductList() {
    const [products, setProducts] = useState([]);
    const [expandedIds, setExpandedIds] = useState([]); // for toggling "read more"
    const { addToCart } = useCart();

    useEffect(() => {
        getProducts().then(setProducts);
    }, []);

    const toggleReadMore = (id) => {
        setExpandedIds((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    return (
        <section className="products">
            <div className="product-grid">
            {products.map((product) => {
                const isExpanded = expandedIds.includes(product.id); // 💡 define it here inside the map

                return (
                <div className="product-card" key={product.id}>
                    <div className="product-image-wrapper">
                    <img
                        src={product.images[0]?.src}
                        alt={product.images[0]?.alt || product.name}
                    />
                    </div>
                    <h2 className="product-title">{product.name}</h2>

                    <div
                    className="product-price"
                    dangerouslySetInnerHTML={{ __html: product.price_html }}
                    />

                    <div
                    className={`product-description ${isExpanded ? '' : 'clamped'}`}
                    dangerouslySetInnerHTML={{
                        __html: product.short_description || product.description,
                    }}
                    />

                    <button
                    className="read-more-btn"
                    onClick={() => toggleReadMore(product.id)}
                    >
                    {isExpanded ? 'Read less' : 'Read more'}
                    </button>

                    <button className="add-to-cart-btn" onClick={() => addToCart(product)}>
                    Add to Cart
                    </button>
                </div>
                );
            })}
            </div>
        </section>
    );
}
