import Review from "../../models/Review";
import {ReviewStar} from "./ReviewStar";

export const ReviewComponent: React.FC<{
    review: Review
}> = (props) => {
    const date = new Date(props.review.date);
    const month = date.toLocaleString("en-us", {month: 'long'});
    const dateDay = date.getDate();
    const dateYear = date.getFullYear();
    const dateRender = month + ' ' + dateDay + ', ' +  dateYear;

    return (
        <div>
            <div className="col-sm-8 col-md-8">
                <h5>{ props.review.userEmail }</h5>
                <div className="row">
                    <div className="col">
                        {dateRender}
                    </div>
                    <div className="col">
                        <ReviewStar rating={props.review.rating} size={16} />
                    </div>
                </div>
                <div className="mt-2">
                    <p>
                        { props.review.reviewDescription}
                    </p>
                </div>
            </div>
        </div>
    )
}