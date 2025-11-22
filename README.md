# UniPlanner Pro

UniPlanner Pro is a modern, interactive semester planner for university students. It allows you to manage your courses, visualize your weekly schedule, and export your plan in various formats.

## Features

- **Course Management**: Add, edit, and delete courses with details like code, name, instructor, classroom, and credits.
- **Interactive Calendar**: Visualize your weekly schedule.
- **Conflict Detection**: Automatically detects and warns about scheduling conflicts.
- **Customization**:
  - Dark/Light mode support.
  - English/Turkish language support.
  - Customizable course colors.
  - Adjustable calendar view (daily/weekly, start of week, time increments).
- **Export Options**:
  - Download as Image (PNG).
  - Download as PDF.
  - Add to Calendar (.ics export).
- **Local Storage**: Your data is saved locally in your browser, so you never lose your schedule.

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **PDF Generation**: [jspdf](https://github.com/parallax/jsPDF) & [html-to-image](https://github.com/bubkoo/html-to-image)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/uniplanner-pro.git
   cd uniplanner-pro
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Building for Production

To create a production build:

```bash
npm run build
```

To start the production server:

```bash
npm start
```

## License

This project is licensed under the MIT License.
