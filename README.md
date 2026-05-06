# Drive Video Rename Automation

## Overview
This project uses Google Apps Script to automatically rename Google Drive video files based on data from a Google Sheet.

## Problem
Video file names were being entered manually, even though the required naming details already existed in the tracking sheet. This caused duplicate effort and possible naming mistakes.

## Solution
The script reads data from Google Sheets and renames the linked Drive video files automatically.

## Naming Format
Main video file:

ID_1234_SBS_Yes_P3

If the mistake column is marked Yes, the additional video in Column H is renamed without the Yes/No value:

ID_1234_SBS_P3

## Sheet Columns Used
- Column A: ID value
- Column D: Category, example P3
- Column E: Main video Drive link
- Column G: Mistake Yes/No
- Column H: Additional file link if mistake is Yes

## Key Features
- Works across all sheet tabs
- Reads smart chips / embedded Drive links
- Does not edit the Google Sheet
- Only renames files in Google Drive
- Skips invalid or missing links safely

## Technology Used
- Google Apps Script
- JavaScript
- Google Sheets service
- Google Drive service

## Safety Note
This script only reads data from the sheet. It does not update, delete, or modify any sheet data.
