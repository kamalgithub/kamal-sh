export interface SecurityCopy {
	heading: string;
	intro: string;
	cspNoteHeading: string;
	cspNoteBody: string;
	reportingHeading: string;
	/** Text before the email link, e.g. "Email ". */
	reportingEmailLeadIn: string;
	/** Text between the email link and the security.txt link, e.g. ", or see ". */
	reportingBetween: string;
	/** Label for the security.txt link, e.g. "security.txt". */
	reportingSecurityTxtLabel: string;
	/** Text after the security.txt link, e.g. " for the machine-readable version of the same contact." */
	reportingTrailer: string;
}
