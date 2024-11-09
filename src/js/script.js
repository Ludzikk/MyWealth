import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
	getAuth,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	browserLocalPersistence,
	onAuthStateChanged,
	signOut,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import {
	getDatabase,
	ref,
	set,
	get,
	onValue,
	update,
	remove,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

const overviewBox = document.querySelector(".main__box");
const profileBox = document.querySelector(".main__profile");
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
const subChangePopup = document.querySelector(".subchange__popup");
const addSubPopup = document.querySelector(".sub__popup");
const addIncomeBtn = document.querySelector("#addIncome");
const addExpenseBtn = document.querySelector("#addExpense");
const addSubBtn = document.querySelector("#addSub");
const changeSubBtn = document.querySelector("#changeSub");
const incomeBoxBtn = document.querySelector("#incomeBtn");
const expenseBoxBtn = document.querySelector("#expenseBtn");
const subBoxBtn = document.querySelector("#subBtn");
const addIncomeInput = document.querySelector("#addIncomeInput");
const addExpenseInput = document.querySelector("#addExpenseInput");
const expenseSelect = document.querySelector("#expenseType");
const subNameInput = document.querySelector("#addSubName");
const subPriceInput = document.querySelector("#addSubAmount");
const subPayementInput = document.querySelector("#addPaymentInterval");
const subChangePriceInput = document.querySelector("#changeSubAmount");
const subChangeNameInput = document.querySelector("#changeSubName");
const signoutBtn = document.querySelector("#signout");
const profileBtn = document.querySelector("#profile");
const overviewBtn = document.querySelector("#overview");
const revenueBoxScroll = document.querySelector(".main__revenue-list");
const userEmail = document.querySelector("#profile__email");
const profileLimitInput = document.querySelector(".profile__input");
const currencySelect = document.querySelector("#currencySelect");
const profileOptions = document.querySelectorAll(".profile__option");
let subDotsBtn = "";
let subXBtns = "";
let subTypesBtn = "";
let currentChangeSubId = "";

const currentDate = new Date();
const year = new Date().getFullYear();
const month = new Date().getMonth() + 1;
const mili = new Date().getMilliseconds();
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

// this function is checking if user want to sing up or sign in
const checkWhatTypeOfAction = () => {
	// we check which btn is active (clicked)
	loginTopBtn.forEach((btn) => {
		if (btn.classList.contains("login-btn-active")) {
			inputType = btn.id; // we set active btn id to variable
		}
	});

	// now depending on whats is set in variable we createUser or loginUser
	switch (inputType) {
		case "signup":
			createUser();
			break;
		case "signin":
			loginUser();
			break;
	}
};

const checkUserAuth = () => {
	onAuthStateChanged(auth, (user) => {
		if (user) {
			// Jeśli użytkownik jest zalogowany, ustaw wszystko
			setEverything();
			console.log("User is already logged in:", user.email);
		} else {
			console.log("No user is logged in");
		}
	});
};

const createUser = () => {
	// we check if inputs are not empty and double check if user want to sign up
	if (
		passwordInput.value !== "" &&
		emailInput.value !== "" &&
		inputType === "signup"
	) {
		createUserWithEmailAndPassword(auth, emailInput.value, passwordInput.value)
			.then((userCredential) => {
				const user = userCredential.user;

				// set user main data
				set(ref(db, `users/${user.uid}`), {
					email: emailInput.value,
					currency: "$",
					limit: 3000,
				}).catch((error) => {
					console.error("Error adding user:", error);
				});

				// we set user database structure
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
				}).catch((error) => {
					console.error("Error adding user:", error);
				});
			})
			.catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;
				console.error("Error creating user:", errorCode, errorMessage);
			});

		// when user get created show and count every data
		setEverything();
	}
};

const loginUser = () => {
	// we check if inputs are not empty and double check if user want to log in
	if (
		passwordInput.value !== "" &&
		emailInput.value !== "" &&
		inputType === "signin"
	) {
		signInWithEmailAndPassword(auth, emailInput.value, passwordInput.value)
			.then(() => {
				setEverything();
			})
			.catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;
				console.error("Error signing in:", errorCode, errorMessage);
			});
	}
};

const signoutUser = () => {
	signOut(auth)
		.then(() => {
			console.log("User signed out successfully");
			// Opcjonalnie: przekieruj użytkownika na stronę logowania lub odśwież stronę
			window.location.reload(); // lub window.location.href = '/login.html';
		})
		.catch((error) => {
			console.error("Error signing out:", error);
		});
};

const setItemsToSubBox = () => {
	auth.onAuthStateChanged((user) => {
		const subsRef = ref(db, `users/${user.uid}/subs`);

		onValue(subsRef, (snapshot) => {
			subsriptionBox.innerHTML = "";
			if (snapshot.exists()) {
				snapshot.forEach((childSnapshot) => {
					const childData = childSnapshot.val();

					const subItem = document.createElement("div");
					const subItemLeft = document.createElement("div");
					const subItemName = document.createElement("p");
					const subItemNextPayment = document.createElement("p");
					const subItemRight = document.createElement("div");
					const subItemPrice = document.createElement("p");
					const subItemIcon = document.createElement("i");
					const subBg = document.createElement("div");
					const subBgBtns = document.createElement("div");
					const subBgBtn1 = document.createElement("button");
					const subBgBtn2 = document.createElement("button");
					const subBgIcon = document.createElement("i");

					subItem.id = childSnapshot.key;
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
					subItemIcon.classList.add(
						"fa-solid",
						"fa-ellipsis-vertical",
						"sub-dots"
					);
					subBg.classList.add("main__subsbox-item-bg");
					subBgBtns.classList.add("main__subsbox-item-btns");
					subBgBtn1.classList.add("main__subsbox-item-btn");
					subBgBtn2.classList.add("main__subsbox-item-btn");
					subBgIcon.classList.add("fa-solid", "fa-x", "sub-x");

					subItemName.textContent = childData.name;
					subItemPrice.innerHTML = `${childData.price}<span class="currency"></span>`;

					const paymentDate = new Date(childData.dateOfPay);
					subItemNextPayment.textContent = `Next ${paymentDate.getDate()} ${
						monthNames[paymentDate.getMonth()]
					}`;

					subBgBtn1.textContent = "Delete";
					subBgBtn2.textContent = "Edit";

					subItemLeft.append(subItemName, subItemNextPayment);
					subItemRight.append(subItemPrice, subItemIcon);
					subBgBtns.append(subBgBtn1, subBgBtn2);
					subBg.append(subBgBtns, subBgIcon);
					subItem.append(subBg, subItemLeft, subItemRight);
					subsriptionBox.append(subItem);

					subDotsBtn = document.querySelectorAll(".sub-dots");
					subDotsBtn.forEach((btn) => {
						btn.addEventListener("click", subOptions);
					});
					subXBtns = document.querySelectorAll(".sub-x");
					subXBtns.forEach((btn) => {
						btn.addEventListener("click", subOptions);
					});
					subTypesBtn = document.querySelectorAll(".main__subsbox-item-btn");
					subTypesBtn.forEach((btn) => {
						btn.addEventListener("click", subType);
					});
				});
			}
			totalSubs.textContent = subsriptionBox.childElementCount;
			setCurrency();
		});
	});
};

function subOptions() {
	const itemBox = this.parentElement.parentElement;

	itemBox.firstElementChild.classList.toggle("sub-active");
}

const checkIfSubsGotPayed = () => {
	auth.onAuthStateChanged((user) => {
		const subRef = ref(db, `users/${user.uid}/subs`);

		get(subRef).then((snapshot) => {
			snapshot.forEach((snapshotChild) => {
				const childData = snapshotChild.val();
				const dateOfPay = childData.dateOfPay;
				const dateOfNextPay = new Date(dateOfPay);
				dateOfNextPay.setMonth(
					dateOfNextPay.getMonth() + parseInt(childData.paymentIntervalInMonths)
				);
				let nextPayDate;

				if (dateOfNextPay.getMonth() === 0) {
					nextPayDate = `${dateOfNextPay.getFullYear()}, ${
						dateOfNextPay.getMonth() + 1
					}, ${dateOfNextPay.getDate()}`;
				} else {
					nextPayDate = `${dateOfNextPay.getFullYear()}, ${dateOfNextPay.getMonth()}, ${dateOfNextPay.getDate()}`;
				}

				if (currentDate >= new Date(dateOfPay)) {
					update(ref(db, `users/${user.uid}/subs/${snapshotChild.key}`), {
						dateOfBuy: dateOfPay,
						dateOfPay: nextPayDate,
					});
				}
			});
		});
	});
};

function subType() {
	auth.onAuthStateChanged((user) => {
		const subsRef = ref(
			db,
			`users/${user.uid}/subs/${this.parentElement.parentElement.parentElement.id}`
		);
		const expenseRef = ref(
			db,
			`users/${user.uid}/money/year${year}/month${month}/expense`
		);
		const typesRef = ref(
			db,
			`users/${user.uid}/money/year${year}/month${month}/types`
		);
		const miscRef = ref(
			db,
			`users/${user.uid}/money/year${year}/month${month}/types/miscellaneous`
		);

		switch (this.textContent) {
			case "Delete":
				get(subsRef).then((snapshot) => {
					if (snapshot.exists()) {
						const subData = snapshot.val();

						get(expenseRef).then((snapshotExpense) => {
							if (snapshotExpense.exists()) {
								const currentExpense = snapshotExpense.val();

								update(
									ref(db, `users/${user.uid}/money/year${year}/month${month}`),
									{
										expense:
											parseFloat(currentExpense) - parseFloat(subData.price),
									}
								);
							}
						});

						get(miscRef).then((snapshotTypes) => {
							if (snapshotTypes.exists()) {
								update(typesRef, {
									miscellaneous:
										parseFloat(snapshotTypes.val()) - parseFloat(subData.price),
								});
							}
						});

						remove(subsRef);
					}
				});
				break;
			case "Edit":
				toggleChangeSubPopup(this);
				break;
		}

		const itemBox = this.parentElement.parentElement.parentElement;
		itemBox.firstElementChild.classList.toggle("sub-active");
	});
}

const setCurrentIncomeAndExpense = () => {
	auth.onAuthStateChanged((user) => {
		const incomePath = `users/${user.uid}/money/year${year}/month${month}/income`;
		const incomeRef = ref(db, incomePath);

		onValue(incomeRef, (snapshot) => {
			if (snapshot.exists()) {
				incomeTotal.textContent = formatNumber(snapshot.val());
			} else {
				console.log("No data available for this path.");
			}
		});

		const expensePath = `users/${user.uid}/money/year${year}/month${month}/expense`;
		const expenseRef = ref(db, expensePath);

		onValue(expenseRef, (snapshot) => {
			if (snapshot.exists()) {
				expenseTotal.textContent = formatNumber(snapshot.val());
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
				// console.log("User have " + year + " year");
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
				// console.log("Need to create" + year + " year");
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
				});
				checkIfUserNeedNewDateInDataBase();
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

function toggleChangeSubPopup(element) {
	subChangePopup.classList.toggle("hidden");

	auth.onAuthStateChanged((user) => {
		const subsRef = ref(
			db,
			`users/${user.uid}/subs/${element.parentElement.parentElement.parentElement.id}`
		);

		get(subsRef).then((snapshot) => {
			const subData = snapshot.val();
			subChangeNameInput.value = subData.name;
			subChangePriceInput.value = subData.price;
		});
		currentChangeSubId = element.parentElement.parentElement.parentElement.id;
	});
}

const toggleAddSub = () => {
	addSubPopup.classList.toggle("hidden");
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
									date: `${currentDate.getDate()}.${month}.${year}`,
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

const addSub = () => {
	auth.onAuthStateChanged((user) => {
		if (
			subNameInput.value !== "" &&
			subPriceInput.value !== "" &&
			subPayementInput.value !== ""
		) {
			const expenseRef = ref(
				db,
				`users/${user.uid}/money/year${year}/month${month}/expense`
			);

			const boughtDate = new Date(
				`${year}, ${month}, ${currentDate.getDate()}`
			);
			const nextPaymentDate = new Date(
				boughtDate.setMonth(
					boughtDate.getMonth() + parseInt(subPayementInput.value)
				)
			);

			update(
				ref(
					db,
					`users/${user.uid}/subs/${mili * Math.floor(Math.random() * 100)}`
				),
				{
					name: subNameInput.value,
					price: subPriceInput.value,
					dateOfBuy: `${year}, ${month}, ${currentDate.getDate()}`,
					paymentIntervalInMonths: subPayementInput.value,
					dateOfPay: `${nextPaymentDate.getFullYear()}, ${
						nextPaymentDate.getMonth() + 1
					}, ${nextPaymentDate.getDate()}`,
				}
			);

			get(expenseRef)
				.then((snapshot) => {
					if (snapshot.exists()) {
						update(
							ref(db, `users/${user.uid}/money/year${year}/month${month}`),
							{
								expense: snapshot.val() + parseFloat(subPriceInput.value),
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
								miscellaneous: snapshot.val() + parseFloat(subPriceInput.value),
							}
						);
					})
				);
		}

		toggleAddSub();
	});
};

const changeSub = () => {
	if (subChangeNameInput.value !== "" && subChangePriceInput.value !== "") {
		auth.onAuthStateChanged((user) => {
			const subRef = ref(db, `users/${user.uid}/subs/${currentChangeSubId}`);
			const expenseRef = ref(
				db,
				`users/${user.uid}/money/year${year}/month${month}/expense`
			);
			const monthRef = ref(
				db,
				`users/${user.uid}/money/year${year}/month${month}`
			);
			const typesRef = ref(
				db,
				`users/${user.uid}/money/year${year}/month${month}/types`
			);
			const miscRef = ref(
				db,
				`users/${user.uid}/money/year${year}/month${month}/types/miscellaneous`
			);
			let currentExpense = 0;
			let currentSubValue = 0;
			let newSubValue = 0;
			let currentMisc = 0;

			get(subRef).then((snapshot) => {
				const subData = snapshot.val();
				currentSubValue = subData.price;
				newSubValue = subChangePriceInput.value;

				update(subRef, {
					name: subChangeNameInput.value,
					price: parseFloat(subChangePriceInput.value),
				});
			});

			get(miscRef)
				.then((snapshot) => {
					currentMisc = snapshot.val();
				})
				.then(() => {
					update(typesRef, {
						miscellaneous:
							parseFloat(currentMisc) -
							parseFloat(currentSubValue) +
							parseFloat(newSubValue),
					});
				});

			get(expenseRef)
				.then((snapshot) => {
					currentExpense = snapshot.val();
				})
				.then(() => {
					update(monthRef, {
						expense:
							parseFloat(currentExpense) -
							parseFloat(currentSubValue) +
							parseFloat(newSubValue),
					});
				});
		});

		subChangePopup.classList.toggle("hidden");
		setTotalBalance();
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
								 <p class="main__text main__text--20 main__text--bold">-${childData.price}<span class="currency"></span></p>
								  <i class="fa-solid fa-ellipsis-vertical"></i>
										</div> `;
					lastSpendings.append(item);
					orderOfLastSpending++;
				});
			} else {
				console.log("Snapshot for creating last spendings don't exist");
			}
			setCurrency();
		});
	});
};

const setProfileInfo = () => {
	auth.onAuthStateChanged((user) => {
		const emailRef = ref(db, `users/${user.uid}/email`);
		const limitRef = ref(db, `users/${user.uid}/limit`);
		const currencyRef = ref(db, `users/${user.uid}/currency`);

		// set user email info on profile tab
		onValue(emailRef, (snapshot) => {
			if (snapshot.exists()) {
				userEmail.textContent = snapshot.val();
			}
		});

		// set user limit in input
		onValue(limitRef, (snapshot) => {
			if (snapshot.exists()) {
				profileLimitInput.value = snapshot.val();
			}
		});

		// set user currency in select
		onValue(currencyRef, (snapshot) => {
			if (snapshot.exists()) {
				profileOptions.forEach((option) => {
					if (option.value == snapshot.val()) {
						option.selected = true;
					} else {
						option.selected = false;
					}
				});
			}
		});
	});
};

const setCurrency = () => {
	auth.onAuthStateChanged((user) => {
		const currencySpan = document.querySelectorAll(".currency");
		const currencyRef = ref(db, `users/${user.uid}/currency`);

		// set currency on whole site based on user currency in database
		onValue(currencyRef, (snapshot) => {
			if (snapshot.exists()) {
				currencySpan.forEach((item) => {
					item.textContent = snapshot.val();
				});
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

function changeSite() {
	switch (this.id) {
		case "overview":
			overviewBox.classList.remove("hidden");
			profileBox.classList.add("hidden");
			break;
		case "profile":
			overviewBox.classList.add("hidden");
			profileBox.classList.remove("hidden");
			break;
	}
}

const changeLimit = () => {
	auth.onAuthStateChanged((user) => {
		const userRef = ref(db, `users/${user.uid}`);

		update(userRef, {
			limit: parseInt(profileLimitInput.value),
		});
	});
};

const changeCurrency = () => {
	auth.onAuthStateChanged((user) => {
		const userRef = ref(db, `users/${user.uid}`);

		update(userRef, {
			currency: currencySelect.value
		});
	});
};

const setEventListeners = () => {
	loginTopBtn.forEach((btn) => {
		btn.addEventListener("click", setInputType);
	});

	loginBtn.addEventListener("click", checkWhatTypeOfAction);
	addBtnTotalBalance.addEventListener("click", toggleAddIncomePopup);
	incomeBoxBtn.addEventListener("click", toggleAddIncomePopup);
	expenseBoxBtn.addEventListener("click", toggleAddExpensePopup);
	subBoxBtn.addEventListener("click", toggleAddSub);
	addIncomeBtn.addEventListener("click", addIncome);
	addExpenseBtn.addEventListener("click", addExpense);
	addSubBtn.addEventListener("click", addSub);
	changeSubBtn.addEventListener("click", changeSub);
	overviewBtn.addEventListener("click", changeSite);
	profileBtn.addEventListener("click", changeSite);
	signoutBtn.addEventListener("click", signoutUser);
	profileLimitInput.addEventListener("change", changeLimit);
	currencySelect.addEventListener("change", changeCurrency);
};

setEventListeners();

const setEverything = () => {
	loginBox.classList.add("hidden");
	document.body.classList.remove("scroll-hidden");
	checkIfSubsGotPayed();
	checkIfUserNeedNewDateInDataBase();
	setItemsToSubBox();
	setCurrentIncomeAndExpense();
	setTotalBalance();
	setBudgetSpentBox();
	setExpenseSplit();
	createRevenueFlow();
	createLastSpendings();
	setProfileInfo();
	setCurrency();
};

window.onload = () => {
	checkUserAuth();
	revenueBoxScroll.scrollLeft = revenueBoxScroll.scrollWidth;
};
