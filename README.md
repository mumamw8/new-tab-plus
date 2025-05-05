# Useful New Tab

A customizable, modern Chrome extension that transforms your new tab page into a powerful dashboard for bookmarks and reading list management, with beautiful theming options.

## Features

- **Bookmark Explorer:**  
  Browse and open your Chrome bookmarks in a clean, folder-based interface. Quickly navigate folders, view bookmarks, and open them in new tabs.

- **Reading List Integration:**  
  Displays your Chrome Reading List items, showing unread articles with time-since-added. Open articles directly from the new tab.

- **Customizable Appearance:**  
  - **Theme Customizer:**  
    Change the background color or image of your new tab page.
  - **Color Picker & Presets:**  
    Choose from a palette of preset colors or pick any custom color for the background and text.
  - **Light/Dark Mode:**  
    Toggle between light and dark backgrounds.
  - **Auto/Manual Text Color:**  
    Let the extension pick the best text color automatically, or set your own.

- **Responsive Design:**  
  Looks great on all screen sizes.

- **Quick Access:**  
  - Manage bookmarks (opens Chrome's native bookmark manager).
  - Open the extension's options page for further customization.

## Getting Started

### Installation

1. **Clone this repository:**
   ```sh
   git clone <your-repo-url>
   cd useful-new-tab
   ```

2. **Install dependencies:**
   ```sh
   pnpm install
   # or
   npm install
   ```

3. **Build the extension:**
   ```sh
   pnpm build
   # or
   npm run build
   ```

4. **Load into Chrome:**
   - Go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the `dist` folder

### Development

To start a development server with hot reload:
```sh
pnpm dev
# or
npm run dev
```

## Usage

- Open a new tab to see your bookmarks and reading list.
- Click folders to navigate, or use the back button to return.
- Use the menu (three dots) to access options or manage bookmarks.
- Go to the options page to customize the background and text colors.

## Customization

- **Theme Customizer:**  
  Access via the options page. Pick a background color, set a background image, or choose from preset themes.
- **Color Picker:**  
  Fine-tune background and text colors, toggle between HEX/RGB, and copy color values.
- **Presets & History:**  
  Quickly apply preset colors or revert to recently used ones.

## Tech Stack

- **React 19**
- **TypeScript**
- **Vite**
- **Tailwind CSS**
- **DaisyUI**
- **Chrome Extensions API**

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](LICENSE)
