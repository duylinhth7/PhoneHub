

//PHẦN SCRIPT ĐÁNH GIÁ, COMMENT SẢN PHẨM
const fromAddReviews = document.querySelector("[from-add-reviews]");
if (fromAddReviews) {
    fromAddReviews.addEventListener("submit", (e) => {
        e.preventDefault()
        const productId = fromAddReviews.getAttribute("productId")
        const newReview = {
            rating: e.target.rating.value,
            comment: e.target.comment.value,
            productId: productId
        };
        fetch("/reviews/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newReview)
        })
            .then(res => res.json())
            .then(data => {
                if (data) {
                    const reviewList = document.querySelector(".review-list");
                    const html = `
                    <div class="review-item mb-3 p-3" style="border: 1px solid #ccc; border-radius: 8px;">
                        <strong>
                            Bạn
                        </strong>
                        <span class="text-muted ml-2">
                            <small>
                                ${new Date(data.review.createdAt).toLocaleDateString('vi-VN')}
                            </small>
                            <div class="rating">
                                ⭐ ${data.review.rating} / 5
                            </div>
                            <p class="mt-1">
                                ${data.review.comment}
                            </p>
                        </span>
                    </div>
                    `;
                    const div = document.createElement("div");
                    div.innerHTML = html;
                    reviewList.appendChild(div);
                    e.target.comment.value = ""
                };
            })
    })
}
//END PHẦN SCRIPT ĐÁNH GIÁ, COMMENT SẢN PHẨM