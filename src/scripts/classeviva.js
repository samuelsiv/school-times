export class Classeviva {

    static API_URL = import.meta.env.VITE_CVV_API_URL;
    static studentId = "";
    static sessionToken = "";

    static async getToken(username, password) {
        try {
            const response = await fetch(`${this.API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'uid': username,
                    'pass': password
                })
            });
            const data = await response.json();
            console.log('GET Response:', data);
            return data;
        } catch (error) {
            console.error('GET Error:', error);
            return null;
        }
    }

    static async getGrades() {
        try {
            const response = await fetch(`${this.API_URL}/students/${this.studentId}/grades/?ffilter=grades(displayValue)`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Z-Auth-Token': this.sessionToken
                },
            });
            const data = await response.json();
            console.log('GET Response:', data);
            return data;
        } catch (error) {
            console.error('GET Error:', error);
            return null;
        }
    }

    static async getAbsences() {
        try {
            // ABA0 = full (red) day absence
            const response = await fetch(`${this.API_URL}/students/${this.studentId}/absences/details/?dfilter=events(evtCode=ABA0)`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Z-Auth-Token': this.sessionToken
                },
            });
            const data = await response.json();
            console.log('GET Response:', data);
            return data;
        } catch (error) {
            console.error('GET Error:', error);
            return null;
        }
    }

    static async getDelays() {
        try {
            // ABR0 = delay (orange)
            const response = await fetch(`${this.API_URL}/students/${this.studentId}/absences/details/?dfilter=events(evtCode=ABR0)`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Z-Auth-Token': this.sessionToken
                },
            });
            const data = await response.json();
            console.log('GET Response:', data);
            return data;
        } catch (error) {
            console.error('GET Error:', error);
            return null;
        }
    }

    static async getDelays() {
        try {
            // NTNT: appunti
            // NTTE: note dell'insegnante
            // NTCL: note sul registro
            // NTWN: richiami
            // NTST: sanzioni disciplinari
            const response = await fetch(`${this.API_URL}/students/${this.studentId}/notes/all/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Z-Auth-Token': this.sessionToken
                },
            });
            const data = await response.json();
            console.log('GET Response:', data);
            return data;
        } catch (error) {
            console.error('GET Error:', error);
            return null;
        }
    }

    static async getStatus() {
        try {
            // HAT0: presente a lezione
            // HAT1: presente fuori aula
            // HAB0: assente a lezione
            // HNN0: ora senza lezione
            const response = await fetch(`${this.API_URL}/students/${this.studentId}/lessons-status/today`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Z-Auth-Token': this.sessionToken
                },
            });
            const data = await response.json();
            console.log('GET Response:', data);
            return data;
        } catch (error) {
            console.error('GET Error:', error);
            return null;
        }
    }
}