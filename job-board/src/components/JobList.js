import {
	RESULTS_PER_PAGE,
	jobDetailsContentEl,
	jobListSearchEl,
	BASE_API_URL,
	getData,
	state,
} from "../common.js";
import renderError from "./Error.js";
import renderSpinner from "./Spinner.js";
import renderJobDetails from "./JobDetails.js";

// -- JOB LIST COMPONENT --

const renderJobList = () => {
	//remove previous job items
	jobListSearchEl.innerHTML = "";

	//display job items
	state.searchJobItems
		.slice(
			state.currentPage * RESULTS_PER_PAGE - RESULTS_PER_PAGE,
			state.currentPage * RESULTS_PER_PAGE
		)
		.forEach((jobItem) => {
			const newJobItemHTML = `
            <li class="job-item ${
							state.activeJobItem.id === jobItem.id ? "job-item--active" : ""
						}">
                <a class="job-item__link" href="${jobItem.id}">
                    <div class="job-item__badge">${jobItem.badgeLetters}</div>
                    <div class="job-item__middle">
                        <h3 class="third-heading">${jobItem.title}</h3>
                        <p class="job-item__company">${jobItem.company}</p>
                        <div class="job-item__extras">
                            <p class="job-item__extra"><i class="fa-solid fa-clock job-item__extra-icon"></i> ${
															jobItem.duration
														}</p>
                            <p class="job-item__extra"><i class="fa-solid fa-money-bill job-item__extra-icon"></i> ${
															jobItem.salary
														}</p>
                            <p class="job-item__extra"><i class="fa-solid fa-location-dot job-item__extra-icon"></i> ${
															jobItem.location
														}</p>
                        </div>
                    </div>
                    <div class="job-item__right">
                        <i class="fa-solid fa-bookmark job-item__bookmark-icon"></i>
                        <time class="job-item__time">${jobItem.daysAgo}d</time>
                    </div>
                </a>
            </li>
        `;
			jobListSearchEl.insertAdjacentHTML("beforeend", newJobItemHTML);
		});
};

const clickHandler = async (event) => {
	//prevent default behaviour (navigation)
	event.preventDefault();

	// get clicked job item element
	const jobItemEl = event.target.closest(".job-item");

	// remove the active class from previously active job item
	document
		.querySelector(".job-item--active")
		?.classList.remove("job-item--active");

	// add active class
	jobItemEl.classList.add("job-item--active");

	//empty the job details section
	jobDetailsContentEl.innerHTML = "";

	//render spinner
	renderSpinner("job-details");

	//get the id of the job item
	const id = jobItemEl.children[0].getAttribute("href");

	//update state
	state.activeJobItem = state.searchJobItems.find(
		(jobItem) => jobItem.id === +id
	);

	//add id to the url
	history.pushState(null, "", `/#${id}`);

	try {
		//fetch job item data
		const data = await getData(`${BASE_API_URL}/jobs/${id}`);

		//extract job item
		const { jobItem } = data;

		//remove spinner
		renderSpinner("job-details");

		//render job details
		renderJobDetails(jobItem);
	} catch {
		//network problem or other errors (e.g. trying to parse something not json as json)
		renderSpinner("job-details");
		renderError(error.message);
	}
};

jobListSearchEl.addEventListener("click", clickHandler);

export default renderJobList;
