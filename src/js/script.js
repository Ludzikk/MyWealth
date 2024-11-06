import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
	getAuth,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	browserLocalPersistence,
	onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import {
	getDatabase,
	ref,
	set,
	get,
	onValue,
	update,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

const subsriptionBox = document.querySelector(".main__subsbox");
const totalSubs = document.querySelector("#totalSubs");
const incomeTotal = document.querySelector("#incomeTotal");
const expenseTotal = document.querySelector("#expenseTotal");
const incomePercent = document.querySelector("#incomePercent");
const expensePercent = document.querySelector("#expensePercent");
const totalBalance = document.querySelector("#totalBalance");
const revenueLastMonth = document.querySelector("#revenueLastMonth");
const budgetSpent = document.querySelector("#amountSpent");
const budgetLimit = document.querySelector("#amountToSpent");
const budgetLeft = document.querySelector("#amountLeft");
const expenseSplitTotal = document.querySelector("#expenseSplitTotal");
const expenseSplitMonth = document.querySelector("#expenseSplitMonth");
const foodPercent = document.querySelector("#food");
const healthPercent = document.querySelector("#health");
const billsPercent = document.querySelector("#bills");
const entertainmentPercent = document.querySelector("#entertainment");
const transportationPercent = document.querySelector("#transportation");
const miscellaneousPercent = document.querySelector("#miscellaneous");
const expenseSplitCircle = document.querySelector(".main__circle");
const revenueList = document.querySelector(".main__revenue-list");
const lastSpendings = document.querySelector(".main__last-list");
const loginTopBtn = document.querySelectorAll(".login__topbtn");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");
const loginBtn = document.querySelector(".login__mainbtn");
const loginBox = document.querySelector(".login");
const addBtnTotalBalance = document.querySelector("#addTotal");
const addIncomePopup = document.querySelector(".add__popup");
const addExpensePopup = document.querySelector(".expense__popup");
const addIncomeBtn = document.querySelector("#addIncome");
const addExpenseBtn = document.querySelector("#addExpense");
const incomeBoxBtn = document.querySelector("#incomeBtn");
const expenseBoxBtn = document.querySelector("#expenseBtn");
const addIncomeInput = document.querySelector("#addIncomeInput");
const addExpenseInput = document.querySelector("#addExpenseInput");
const expenseSelect = document.querySelector("#expenseType");

const currentDate = new Date();
const year = new Date().getFullYear();
const month = new Date().getMonth() + 1;
const mili = new Date().getMilliseconds();
const idOfuserCreation = mili * Math.floor(Math.random() * 20000);
let maxIncome = 0;
let orderOfLastSpending = 0;
let inputType = "";
let userLimit = 0;
let totalUserBalance = 0;

const monthNames = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];

const monthNamesShort = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sept",
	"Oct",
	"Nov",
	"Dec",
];

const firebaseConfig = {
	apiKey: "AIzaSyAnQPHugOMwt4HwC-i-1srtFBr8oe1OEiY",
	authDomain: "mywealth-8f207.firebaseapp.com",
	projectId: "mywealth-8f207",
	storageBucket: "mywealth-8f207.appspot.com",
	messagingSenderId: "735896347785",
	appId: "1:735896347785:web:851e7179c61fb1e4e59258",
	databaseURL:
		"https://mywealth-8f207-default-rtdb.europe-west1.firebasedatabase.app",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

const checkWhatTypeOfAction = () => {
	loginTopBtn.forEach((btn) => {
		if (btn.classList.contains("login-btn-active")) {
			inputType = btn.id;
		}
	});

	switch (inputType) {
		case "signup":
			createUser();
			break;
		case "signin":
			loginUser();
			break;
	}
};

const createUser = () => {
	if (
		passwordInput.value !== "" &&
		emailInput.value !== "" &&
		inputType === "signup"
	) {
		createUserWithEmailAndPassword(auth, emailInput.value, passwordInput.value)
			.then((userCredential) => {
				const user = userCredential.user;

				set(ref(db, `users/${user.uid}`), {
					email: emailInput.value,
					currency: "$",
					limit: 3000,
				})
					.then(() => {
						console.log("New user added to database");
					})
					.catch((error) => {
						console.error("Error adding user:", error);
					});

				set(ref(db, `users/${user.uid}/money/year${year}/month${month}`), {
					income: 0,
					expense: 0,
					types: {
						food: 0,
						health: 0,
						bills: 0,
						entertainment: 0,
						transportation: 0,
						miscellaneous: 0,
					},
				})
					.then(() => {
						console.log("New user added to database");
					})
					.catch((error) => {
						console.error("Error adding user:", error);
					});
			})
			.catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;
				console.error("Error creating user:", errorCode, errorMessage);
			});

		setEverything();
	}
};

const loginUser = () => {
	if (
		passwordInput.value !== "" &&
		emailInput.value !== "" &&
		inputType === "signin"
	) {
		signInWithEmailAndPassword(auth, emailInput.value, passwordInput.value)
			.then((userCredential) => {
				// Signed in
				const user = userCredential.user;
				console.log("User signed in:", user);
			})
			.catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;
				console.error("Error signing in:", errorCode, errorMessage);
			});

		setEverything();
	}
};

const userData = {
	money: {
		year2024: {
			month8: {
				income: 200,
				expense: 60,
				get moneyLeft() {
					return this.income - this.expense;
				},
				types: {
					food: 10,
					health: 10,
					bills: 10,
					entertainment: 10,
					transportation: 10,
					miscellaneous: 10,
				},
			},
			month9: {
				income: 600,
				expense: 450,
				get moneyLeft() {
					return this.income - this.expense;
				},
				types: {
					food: 50,
					health: 40,
					bills: 250,
					entertainment: 20,
					transportation: 75.02,
					miscellaneous: 14.98,
				},
			},
			month10: {
				income: 700,
				expense: 500,
				get moneyLeft() {
					return this.income - this.expense;
				},
				types: {
					food: 50,
					health: 40,
					bills: 250,
					entertainment: 95.02,
					transportation: 50,
					miscellaneous: 14.98,
				},
				spendings: {
					spen0: {
						type: "Food",
						date: "12.10.2024",
						price: 50,
					},
					spen1: {
						type: "Health",
						date: "14.10.2024",
						price: 40,
					},
					spen2: {
						type: "Bills",
						date: "15.10.2024",
						price: 250,
					},
					spen3: {
						type: "Entertainment",
						date: "21.10.2024",
						price: 95.02,
					},
					spen4: {
						type: "Transportation",
						date: "24.10.2024",
						price: 50,
					},
					spen5: {
						type: "Miscellaneous",
						date: "29.10.2024",
						price: 14.98,
					},
				},
			},
			month11: {
				income: 600,
				expense: 450,
				get moneyLeft() {
					return this.income - this.expense;
				},
				types: {
					food: 50,
					health: 40,
					bills: 250,
					entertainment: 20,
					transportation: 75.02,
					miscellaneous: 14.98,
				},
			},
		},
	},
	subscriptions: {
		id0: {
			name: "HBO",
			dateOfBought: "2024, 10, 29",
			nextPaymentInMonths: 1,
			price: 5.99,
		},
		id1: {
			name: "Discord Nitro",
			dateOfBought: "2024, 10, 13",
			nextPaymentInMonths: 3,
			price: 8.99,
		},
	},
	currency: "$",
	limit: 3000,
};
const subscriptionsLength = Object.keys(userData.subscriptions).length;

const findMaxIncome = () => {
	for (let year in userData.money) {
		for (let month in userData.money[year]) {
			let income = userData.money[year][month].income;
			if (income > maxIncome) {
				maxIncome = income;
			}
		}
	}
};

const setItemsToSubBox = () => {
	subsriptionBox.innerHTML = "";

	auth.onAuthStateChanged((user) => {
		const subsRef = ref(db, `users/${user.uid}/subs`);

		onValue(subsRef, (snapshot) => {
			if (snapshot.exists()) {
				snapshot.forEach((childSnapshot) => {
					const childData = childSnapshot.val();

					const boughtDate = new Date(childData.dateOfBuy);
					const nextPaymentDate = new Date(
						boughtDate.setMonth(
							boughtDate.getMonth() + childData.nextPaymentInMonths
						)
					);

					const subItem = document.createElement("div");
					const subItemLeft = document.createElement("div");
					const subItemName = document.createElement("p");
					const subItemNextPayment = document.createElement("p");
					const subItemRight = document.createElement("div");
					const subItemPrice = document.createElement("p");
					const subItemIcon = document.createElement("i");

					subItem.classList.add("main__subsbox-item");
					subItemRight.classList.add("display-flex", "aligncenter");
					subItemName.classList.add("main__text", "main__text--20");
					subItemNextPayment.classList.add(
						"main__text",
						"main__text--80alpha",
						"main__text--14"
					);
					subItemPrice.classList.add(
						"main__text",
						"main__text--20",
						"main__text--bold"
					);
					subItemIcon.classList.add("fa-solid", "fa-ellipsis-vertical");

					subItemName.textContent = childData.name;
					subItemPrice.textContent = "$" + childData.price;
					subItemNextPayment.textContent = `Next ${nextPaymentDate.getDate()} ${
						monthNames[nextPaymentDate.getMonth()]
					}`;

					subItemLeft.append(subItemName, subItemNextPayment);
					subItemRight.append(subItemPrice, subItemIcon);
					subItem.append(subItemLeft, subItemRight);
					subsriptionBox.append(subItem);

					totalSubs.textContent = subsriptionBox.childElementCount;
				});
			}
		});
	});
};

const setCurrentIncomeAndExpense = () => {
	auth.onAuthStateChanged((user) => {
		const incomePath = `users/${user.uid}/money/year${year}/month${month}/income`;
		const incomeRef = ref(db, incomePath);

		onValue(incomeRef, (snapshot) => {
			if (snapshot.exists()) {
				incomeTotal.textContent = snapshot.val();
			} else {
				console.log("No data available for this path.");
			}
		});

		const expensePath = `users/${user.uid}/money/year${year}/month${month}/expense`;
		const expenseRef = ref(db, expensePath);

		onValue(expenseRef, (snapshot) => {
			if (snapshot.exists()) {
				expenseTotal.textContent = snapshot.val();
			} else {
				console.log("No data available for this path.");
			}
		});

		let userHavePreviousMonth = false;
		get(ref(db, `users/${user.uid}/money/year${year}/month${month - 1}`)).then(
			(snapshot) => {
				if (snapshot.exists()) {
					userHavePreviousMonth = true;

					if (userHavePreviousMonth !== false) {
						let thisMonthIncome = 0;
						let lastMonthIncome = 0;

						// this month income
						get(
							ref(
								db,
								`users/${user.uid}/money/year${year}/month${month}/income`
							)
						).then((snapshot) => {
							if (snapshot.exists()) {
								thisMonthIncome = snapshot.val();
							}
						});

						// last month income
						get(
							ref(
								db,
								`users/${user.uid}/money/year${year}/month${month - 1}/income`
							)
						).then((snapshot) => {
							if (snapshot.exists()) {
								lastMonthIncome = snapshot.val();

								const thisMonthIncomePercent =
									(thisMonthIncome - lastMonthIncome) / lastMonthIncome;

								if (thisMonthIncomePercent > 0) {
									incomePercent.textContent =
										"+" + parseFloat(thisMonthIncomePercent * 100).toFixed(2);
								} else {
									incomePercent.textContent = parseFloat(
										thisMonthIncomePercent * 100
									).toFixed(2);
								}
							}
						});

						let thisMonthExpense = 0;
						let lastMonthExpense = 0;

						// this month income
						get(
							ref(
								db,
								`users/${user.uid}/money/year${year}/month${month}/expense`
							)
						).then((snapshot) => {
							if (snapshot.exists()) {
								thisMonthExpense = snapshot.val();
							}
						});

						// last month income
						get(
							ref(
								db,
								`users/${user.uid}/money/year${year}/month${month - 1}/expense`
							)
						).then((snapshot) => {
							if (snapshot.exists()) {
								lastMonthExpense = snapshot.val();

								const thisMonthExpensePercent =
									(thisMonthExpense - lastMonthExpense) / lastMonthExpense;

								if (thisMonthExpensePercent > 0) {
									expensePercent.textContent =
										"+" + parseFloat(thisMonthExpensePercent * 100).toFixed(2);
								} else {
									expensePercent.textContent = parseFloat(
										thisMonthExpensePercent * 100
									).toFixed(2);
								}
							}
						});
					} else {
						incomePercent.textContent = 100;
						expensePercent.textContent = 100;
					}
				} else {
					incomePercent.textContent = "0.00";
					expensePercent.textContent = "0.00";
				}
			}
		);
	});
};

const setTotalBalance = () => {
	auth.onAuthStateChanged((user) => {
		if (user) {
			const userId = user.uid;
			let totalUserBalance = 0; // Reset total balance for this calculation

			// Retrieve all years
			get(ref(db, `users/${userId}/money`))
				.then((snapshot) => {
					if (snapshot.exists()) {
						snapshot.forEach((yearSnapshot) => {
							const yearKey = yearSnapshot.key;

							// Retrieve all months within the year
							get(ref(db, `users/${userId}/money/${yearKey}`))
								.then((monthsSnapshot) => {
									monthsSnapshot.forEach((monthSnapshot) => {
										const monthData = monthSnapshot.val();
										if (
											monthData &&
											monthData.income !== undefined &&
											monthData.expense !== undefined
										) {
											// Calculate net balance for the month (income - expense)
											const netBalance = monthData.income - monthData.expense;
											totalUserBalance += netBalance;
										}
									});

									// Update total balance display once per year
									totalBalance.textContent = `${formatNumber(
										totalUserBalance
									)}`;
								})
								.catch((error) => {
									console.error("Error reading month data: ", error);
								});
						});
					} else {
						console.log("No data found for user");
					}
				})
				.catch((error) => {
					console.error("Error reading user data: ", error);
				});

			// Retrieve net balance for last month as a separate task
			const currentYear = new Date().getFullYear();
			const previousMonth = new Date().getMonth(); // Previous month (0-based)

			get(
				ref(
					db,
					`users/${userId}/money/year${currentYear}/month${previousMonth}`
				)
			)
				.then((snapshot) => {
					if (snapshot.exists()) {
						const monthData = snapshot.val();
						if (
							monthData.income !== undefined &&
							monthData.expense !== undefined
						) {
							const netLastMonth = monthData.income - monthData.expense;
							revenueLastMonth.textContent = formatNumber(netLastMonth);
						} else {
							revenueLastMonth.textContent = 0;
						}
					} else {
						revenueLastMonth.textContent = 0;
					}
				})
				.catch((error) => {
					console.error("Error fetching data:", error);
				});
		}
	});
};

const checkIfUserNeedNewDateInDataBase = () => {
	auth.onAuthStateChanged((user) => {
		get(ref(db, `users/${user.uid}/money/year${year}`)).then((snapshot) => {
			if (snapshot.exists()) {
				console.log("User have " + year + " year");

				get(ref(db, `users/${user.uid}/money/year${year}/month${month}`)).then(
					(snapshot) => {
						if (!snapshot.exists()) {
							update(ref(db, `users/${user.uid}/money/year${year}`), {
								[`month${month}`]: {
									income: 0,
									expense: 0,
									types: {
										food: 0,
										health: 0,
										bills: 0,
										entertainment: 0,
										transportation: 0,
										miscellaneous: 0,
									},
								},
							});
						}
					}
				);
			} else {
				console.log("Need to create" + year + " year");
				// checkIfUserNeedNewDateInDataBase();
			}
		});
	});
};

function formatNumber(number) {
	// Zamień liczbę na string z dwiema miejscami po przecinku
	let formattedNumber = number.toFixed(2);

	// Dodaj przecinki co trzy cyfry przed częścią dziesiętną
	formattedNumber = formattedNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

	// Usuń ".00" jeśli liczba kończy się na ".00"
	if (formattedNumber.endsWith(".00")) {
		formattedNumber = formattedNumber.slice(0, -3);
	}

	return formattedNumber;
}

const setBudgetSpentBox = () => {
	auth.onAuthStateChanged((user) => {
		const limitRef = ref(db, `users/${user.uid}/limit`);

		onValue(limitRef, (snapshot) => {
			const userLimit = snapshot.val();

			// Aktualizacja wyświetlanego limitu
			budgetLimit.textContent = formatNumber(userLimit);

			onValue(
				ref(db, `users/${user.uid}/money/year${year}/month${month}/expense`),
				(expenseSnapshot) => {
					if (expenseSnapshot.exists()) {
						const expense = expenseSnapshot.val();
						budgetSpent.textContent = formatNumber(expense);
						budgetLeft.textContent = formatNumber(userLimit - expense);
					} else {
						// Jeśli nie ma jeszcze wydatków w bazie, ustawiamy 0
						budgetSpent.textContent = formatNumber(0);
						budgetLeft.textContent = formatNumber(userLimit);
					}
				}
			);
		});
	});
};

const setExpenseSplit = () => {
	auth.onAuthStateChanged((user) => {
		const expenseRef = ref(
			db,
			`users/${user.uid}/money/year${year}/month${month}/expense`
		);
		const foodRef = ref(
			db,
			`users/${user.uid}/money/year${year}/month${month}/types/food`
		);
		const healthRef = ref(
			db,
			`users/${user.uid}/money/year${year}/month${month}/types/health`
		);
		const billsRef = ref(
			db,
			`users/${user.uid}/money/year${year}/month${month}/types/bills`
		);
		const entertainmentRef = ref(
			db,
			`users/${user.uid}/money/year${year}/month${month}/types/entertainment`
		);
		const transportationRef = ref(
			db,
			`users/${user.uid}/money/year${year}/month${month}/types/transportation`
		);
		const miscellaneousRef = ref(
			db,
			`users/${user.uid}/money/year${year}/month${month}/types/miscellaneous`
		);

		let expenseValue = 0;
		let foodValue = 0;
		let healthValue = 0;
		let billsValue = 0;
		let entertainmentValue = 0;
		let transportationValue = 0;
		let miscellaneousValue = 0;

		let foodValueForCircle = 0;
		let healthValueForCircle = 0;
		let billsValueForCircle = 0;
		let entertainmentValueForCircle = 0;
		let transportationValueForCircle = 0;
		let miscellaneousValueForCircle = 0;
		onValue(expenseRef, (snapshot) => {
			if (snapshot.exists()) {
				expenseValue = snapshot.val();

				expenseSplitTotal.textContent = formatNumber(snapshot.val());
			}

			if (snapshot.val() <= 0) {
				foodPercent.lastElementChild.lastElementChild.textContent = "0%";
				healthPercent.lastElementChild.lastElementChild.textContent = "0%";
				billsPercent.lastElementChild.lastElementChild.textContent = "0%";
				entertainmentPercent.lastElementChild.lastElementChild.textContent =
					"0%";
				miscellaneousPercent.lastElementChild.lastElementChild.textContent =
					"0%";
				transportationPercent.lastElementChild.lastElementChild.textContent =
					"0%";
				return;
			}

			onValue(foodRef, (snapshot) => {
				if (snapshot.exists()) {
					foodValue = snapshot.val();
					foodValueForCircle = parseFloat((foodValue / expenseValue) * 100);

					foodPercent.lastElementChild.lastElementChild.textContent =
						parseInt((foodValue / expenseValue) * 100) + "%";

					setCircleBg(
						foodValueForCircle,
						healthValueForCircle,
						billsValueForCircle,
						entertainmentValueForCircle,
						transportationValueForCircle,
						miscellaneousValueForCircle
					);
				}
			});

			onValue(healthRef, (snapshot) => {
				if (snapshot.exists()) {
					healthValue = snapshot.val();
					healthValueForCircle = parseFloat((healthValue / expenseValue) * 100);

					healthPercent.lastElementChild.lastElementChild.textContent =
						parseInt((healthValue / expenseValue) * 100) + "%";

					setCircleBg(
						foodValueForCircle,
						healthValueForCircle,
						billsValueForCircle,
						entertainmentValueForCircle,
						transportationValueForCircle,
						miscellaneousValueForCircle
					);
				}
			});

			onValue(billsRef, (snapshot) => {
				if (snapshot.exists()) {
					billsValue = snapshot.val();
					billsValueForCircle = parseFloat((billsValue / expenseValue) * 100);

					billsPercent.lastElementChild.lastElementChild.textContent =
						parseInt((billsValue / expenseValue) * 100) + "%";

					setCircleBg(
						foodValueForCircle,
						healthValueForCircle,
						billsValueForCircle,
						entertainmentValueForCircle,
						transportationValueForCircle,
						miscellaneousValueForCircle
					);
				}
			});

			onValue(entertainmentRef, (snapshot) => {
				if (snapshot.exists()) {
					entertainmentValue = snapshot.val();
					entertainmentValueForCircle = parseFloat(
						(entertainmentValue / expenseValue) * 100
					);

					entertainmentPercent.lastElementChild.lastElementChild.textContent =
						parseInt((entertainmentValue / expenseValue) * 100) + "%";

					setCircleBg(
						foodValueForCircle,
						healthValueForCircle,
						billsValueForCircle,
						entertainmentValueForCircle,
						transportationValueForCircle,
						miscellaneousValueForCircle
					);
				}
			});

			onValue(transportationRef, (snapshot) => {
				if (snapshot.exists()) {
					transportationValue = snapshot.val();
					transportationValueForCircle = parseFloat(
						(transportationValue / expenseValue) * 100
					);

					transportationPercent.lastElementChild.lastElementChild.textContent =
						parseInt((transportationValue / expenseValue) * 100) + "%";

					setCircleBg(
						foodValueForCircle,
						healthValueForCircle,
						billsValueForCircle,
						entertainmentValueForCircle,
						transportationValueForCircle,
						miscellaneousValueForCircle
					);
				}
			});

			onValue(miscellaneousRef, (snapshot) => {
				if (snapshot.exists()) {
					miscellaneousValue = snapshot.val();
					miscellaneousValueForCircle = parseFloat(
						(miscellaneousValue / expenseValue) * 100
					);

					miscellaneousPercent.lastElementChild.lastElementChild.textContent =
						parseInt((miscellaneousValue / expenseValue) * 100) + "%";

					setCircleBg(
						foodValueForCircle,
						healthValueForCircle,
						billsValueForCircle,
						entertainmentValueForCircle,
						transportationValueForCircle,
						miscellaneousValueForCircle
					);
				}
			});
		});
	});

	expenseSplitMonth.textContent = monthNamesShort[month - 1];
};

const setCircleBg = (f, h, b, e, t, m) => {
	expenseSplitCircle.style.background = `conic-gradient(#ffe562 0 ${f}%,#f874a3 0 ${
		f + h
	}%,#7776f8 0 ${f + h + b}%,#96e298 0 ${f + h + b + e}%,#d474fc 0 ${
		f + h + b + e + t
	}%,#ff8e62 0 ${f + h + b + e + t + m}%,rgba(0,0,0,.1) 100% 100%)`;
};

const createRevenueFlow = () => {
	auth.onAuthStateChanged((user) => {
		if (user) {
			const yearRef = ref(db, `users/${user.uid}/money/year${year}`);

			onValue(yearRef, (snapshot) => {
				if (snapshot.exists()) {
					let dataByMonth = []; // Array to store data with month indexes for sorting

					// Gather data and sort by month index
					snapshot.forEach((childSnapshot) => {
						const monthKey = childSnapshot.key; // E.g., "month9"
						const childData = childSnapshot.val();
						const monthIndex = parseInt(monthKey.replace("month", "")) - 1; // Get zero-based month index

						// Store month data with index for sorting and display
						dataByMonth.push({
							index: monthIndex,
							income: childData.income,
						});
					});

					// Sort dataByMonth by month index to ensure correct order
					dataByMonth.sort((a, b) => a.index - b.index);

					// Get the last 7 months of data
					const last7MonthsData = dataByMonth.slice(-7);

					// Calculate maxIncome based on the last 7 months
					let maxIncome = Math.max(
						...last7MonthsData.map((month) => month.income)
					);

					// Define where to start inserting the data (from the last item in revenueList backwards)
					let i = 7; // Assumes we start from the end of the list

					// Reverse to display latest months on the right side
					last7MonthsData.reverse().forEach((monthData) => {
						const currentMonthName = monthNamesShort[monthData.index]; // Get month name from `monthNamesShort`
						let currentChildHeight =
							(parseFloat(monthData.income) / maxIncome) * 100;

						// Display month name and income data in the chart
						revenueList.children[i - 1].lastElementChild.textContent =
							currentMonthName;
						revenueList.children[
							i - 1
						].firstElementChild.style.height = `${parseInt(
							currentChildHeight
						)}%`;
						revenueList.children[
							i - 1
						].firstElementChild.firstElementChild.firstElementChild.textContent = `+$${(
							monthData.income / 1000
						).toFixed(2)}K`;

						i--; // Move to the previous element in the chart
					});
				} else {
					console.log(
						"Can't create revenue flow. User doesn't have this year in data"
					);
				}
			});
		} else {
			console.log("User is not logged in.");
		}
	});
};

const toggleAddIncomePopup = () => {
	addIncomePopup.classList.toggle("hidden");
};

const toggleAddExpensePopup = () => {
	addExpensePopup.classList.toggle("hidden");
};

const addIncome = () => {
	if (addIncomeInput.value > 0) {
		auth.onAuthStateChanged((user) => {
			const incomeRef = ref(
				db,
				`users/${user.uid}/money/year${year}/month${month}/income`
			);

			get(incomeRef).then((snapshot) => {
				if (snapshot.exists()) {
					update(ref(db, `users/${user.uid}/money/year${year}/month${month}`), {
						income: snapshot.val() + parseFloat(addIncomeInput.value),
					});
				}
			});
		});

		toggleAddIncomePopup();
		setTotalBalance();
		setCurrentIncomeAndExpense();
	}
};

const addExpense = () => {
	if (addExpenseInput.value > 0) {
		auth.onAuthStateChanged((user) => {
			const expenseRef = ref(
				db,
				`users/${user.uid}/money/year${year}/month${month}/expense`
			);

			get(expenseRef)
				.then((snapshot) => {
					if (snapshot.exists()) {
						update(
							ref(db, `users/${user.uid}/money/year${year}/month${month}`),
							{
								expense: snapshot.val() + parseFloat(addExpenseInput.value),
							}
						);
					}
				})
				.then(
					get(
						ref(
							db,
							`users/${user.uid}/money/year${year}/month${month}/types/${expenseSelect.value}`
						)
					).then((snapshot) => {
						update(
							ref(
								db,
								`users/${user.uid}/money/year${year}/month${month}/types`
							),
							{
								[expenseSelect.value]:
									snapshot.val() + parseFloat(addExpenseInput.value),
							}
						);

						update(
							ref(
								db,
								`users/${user.uid}/money/year${year}/month${month}/spendings`
							),
							{
								[`spen${mili * Math.floor(Math.random() * 1000)}`]: {
									type: expenseSelect.value,
									price: parseFloat(addExpenseInput.value),
									date: `${currentDate.getDay()}.${currentDate.getMonth()}.${currentDate.getFullYear()}`,
								},
							}
						);
					})
				);
		});

		toggleAddExpensePopup();
		setTotalBalance();
		setCurrentIncomeAndExpense();
		setExpenseSplit();
		setBudgetSpentBox();
	}
};

const createLastSpendings = () => {
	auth.onAuthStateChanged((user) => {
		const spendingsRef = ref(
			db,
			`users/${user.uid}/money/year${year}/month${month}/spendings`
		);

		onValue(spendingsRef, (snapshot) => {
			lastSpendings.innerHTML = "";

			if (snapshot.exists()) {
				snapshot.forEach((childSnapshot) => {
					const childData = childSnapshot.val();

					const item = document.createElement("li");
					item.classList.add("main__last-item");
					item.style.order = `-${orderOfLastSpending}`;
					item.innerHTML = `<div class="main__container--30">
				<p class="main__text main__text--upcase main__text--20">${childData.type}</p>
				</div>
					 <div class="main__container--30 no-phone">
					  <p class="main__text main__text--18 main__text--80alpha">${childData.date}</p>
						  </div>
							 <div class="main__container--30">
								 <p class="main__text main__text--20 main__text--bold">-$${childData.price}</p>
								  <i class="fa-solid fa-ellipsis-vertical"></i>
										</div> `;
					lastSpendings.append(item);
					orderOfLastSpending++;
				});
			} else {
				console.log("Snapshot for creating last spendings don't exist");
			}
		});
	});
};

function setInputType() {
	inputType = this.id;

	loginTopBtn.forEach((btn) => {
		btn.classList.remove("login-btn-active");
	});

	this.classList.add("login-btn-active");
}

const setEventListeners = () => {
	loginTopBtn.forEach((btn) => {
		btn.addEventListener("click", setInputType);
	});

	loginBtn.addEventListener("click", checkWhatTypeOfAction);
	addBtnTotalBalance.addEventListener("click", toggleAddIncomePopup);
	incomeBoxBtn.addEventListener("click", toggleAddIncomePopup);
	expenseBoxBtn.addEventListener("click", toggleAddExpensePopup);
	addIncomeBtn.addEventListener("click", addIncome);
	addExpenseBtn.addEventListener("click", addExpense);
};

setEventListeners();

const setEverything = () => {
	loginBox.classList.add("hidden");
	checkIfUserNeedNewDateInDataBase();
	findMaxIncome();
	setItemsToSubBox();
	setCurrentIncomeAndExpense();
	setTotalBalance();
	setBudgetSpentBox();
	setExpenseSplit();
	createRevenueFlow();
	createLastSpendings();
};
