import dotenv from "dotenv";
dotenv.config();
import axios from "axios";
import { sendEmail } from "../utils/sendEmails.js";
import {
	recommendGemstoneFromBirthDetails,
	getBirthstone,
	getRashiGemstone,
} from "../utils/recommendHelper.js";

function parseTime(hour, minute, ampm) {
	let h = parseInt(hour, 10);
	let m = parseInt(minute, 10);

	if (isNaN(h) || isNaN(m)) {
		throw new Error("Invalid time provided");
	}

	// Convert 12-hour format to 24-hour
	if (ampm === "PM" && h !== 12) h += 12;
	if (ampm === "AM" && h === 12) h = 0;

	return [h, m, 0];
}

export async function recommend(req, res) {
	try {
		const {
			name,
			email,
			phone,
			gender,
			purpose,
			budget,
			placeOfBirth,
			country,
			chartStyle,
			dob,
			tob,
		} = req.body;

		// ✅ Validation
		if (!name || !dob || !tob || !placeOfBirth) {
			return res.status(400).json({
				success: false,
				message:
					"Name, Date of Birth, Time of Birth, and Place of Birth are required.",
			});
		}

		// 🗺️ Fetch coordinates using OpenCage API
		const geoApiUrl = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
			placeOfBirth
		)}&key=${process.env.OPENCAGE_API_KEY}`;

		const { data: geoData } = await axios.get(geoApiUrl);
		if (!geoData.results?.length) {
			return res.status(400).json({
				success: false,
				message: "Invalid city or unable to fetch coordinates.",
			});
		}

		const { lat: latitude, lng: longitude } = geoData.results[0].geometry;

		// 📅 Prepare birth date
		// 📅 Prepare birth date
		const { day, month, year } = dob;
		const [hour, minute, second] = parseTime(tob.hour, tob.minute, tob.ampm);

		// ✅ THE FIX: Force the Date string to include the IST offset (+05:30)
		// This guarantees the server calculates the exact same moment as your local computer
		const formattedMonth = String(month).padStart(2, '0');
		const formattedDay = String(day).padStart(2, '0');
		const formattedHour = String(hour).padStart(2, '0');
		const formattedMinute = String(minute).padStart(2, '0');

		const isoString = `${year}-${formattedMonth}-${formattedDay}T${formattedHour}:${formattedMinute}:00+05:30`;
		const birthDate = new Date(isoString);

		// Calculate timezone offset (in hours)
		const timezoneOffset = birthDate.getTimezoneOffset() / 60;

		// 🌕 Astrology recommendations
		const {
			rashi: janmaRashi,
			gemstone: gemstoneFromMoonSign,
			moonLongitude,
		} = recommendGemstoneFromBirthDetails(birthDate, longitude, latitude);

		const firstLetter = name.trim()[0].toUpperCase();
		const gemstoneFromNameLetter = getRashiGemstone(firstLetter);
		const birthstoneByMonth = getBirthstone(parseInt(month));

		const emailHtml = `
			<h2>New Gemstone Suggestion Request</h2>
			<table cellpadding="8" cellspacing="0" border="1" style="border-collapse:collapse; font-family:Arial, sans-serif;">
				<tr><td><strong>Name</strong></td><td>${name}</td></tr>
				<tr><td><strong>Email</strong></td><td>${email || "N/A"}</td></tr>
				<tr><td><strong>Phone</strong></td><td>${phone || "N/A"}</td></tr>
				<tr><td><strong>Gender</strong></td><td>${gender || "N/A"}</td></tr>
				<tr><td><strong>Purpose</strong></td><td>${purpose || "N/A"}</td></tr>
				<tr><td><strong>Budget</strong></td><td>${budget || "N/A"}</td></tr>
				<tr><td><strong>Chart Style</strong></td><td>${chartStyle || "N/A"}</td></tr>
				<tr><td><strong>Country</strong></td><td>${country || "N/A"}</td></tr>
				<tr><td><strong>Place of Birth</strong></td><td>${placeOfBirth}</td></tr>
				<tr><td><strong>Date of Birth</strong></td><td>${dob.day}/${dob.month}/${dob.year}</td></tr>
				<tr><td><strong>Time of Birth</strong></td><td>${tob.hour}:${tob.minute} ${tob.ampm}</td></tr>
				<tr><td><strong>Latitude</strong></td><td>${latitude}</td></tr>
				<tr><td><strong>Longitude</strong></td><td>${longitude}</td></tr>
				<tr><td><strong>Moon Rashi</strong></td><td>${janmaRashi}</td></tr>
				<tr><td><strong>Moon Sign Gemstone</strong></td><td>${gemstoneFromMoonSign}</td></tr>
				<tr><td><strong>Name Letter Gemstone</strong></td><td>${gemstoneFromNameLetter}</td></tr>
				<tr><td><strong>Birth Month Gemstone</strong></td><td>${birthstoneByMonth}</td></tr>
			</table>
		`;

		try {
			await sendEmail({
				to: "sameer@gemrishi.com",
				subject: `New Gemstone Suggestion from ${name}`,
				html: emailHtml,
			});
		} catch (emailError) {
			console.error("Gemstone suggestion email failed:", emailError);
		}

		return res.status(200).json({
			success: true,
			data: {
				name,
				email,
				phone,
				gender,
				purpose,
				budget,
				placeOfBirth,
				country,
				chartStyle,
				dob,
				tob,
				latitude,
				longitude,
				janmaRashi,
				gemstoneFromMoonSign,
				gemstoneFromNameLetter,
				birthstoneByMonth,
				moonLongitude,
			},
		});
	} catch (error) {
		console.error("Error in recommend:", error);
		return res.status(500).json({
			success: false,
			message: "Internal Server Error",
		});
	}
}
