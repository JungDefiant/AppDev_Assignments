Part 1 – Load and Clean Data

    Load the dataset into a Pandas DataFrame.

    Drop or clean any irrelevant columns or missing values to ensure your numeric sales columns contain complete data records.

Part 2 – Correlation Matrix Operations

    Isolate the sales columns and use the .corr() method to calculate the Pearson correlation coefficient matrix across all regions. Display this matrix in your notebook.

    Identify the Strongest Dynamic: Programmatically or analytically isolate the pair of distinct variables (excluding self-correlations like NA_Sales with NA_Sales) that display the strongest linear correlation.

    Identify the Weakest Dynamic: Isolate the pair of distinct variables that show the weakest correlation (the coefficient value closest to 0).

Part 3 – Visualizing the Matrix

    Using the seaborn library, generate a visual Heatmap (sns.heatmap()) of your correlation matrix.

    Ensure your heatmap includes:

        Visible numerical data annotations inside the blocks (annot=True).

        A cohesive color palette.

        A clear, descriptive chart title and properly rotated labels.

Part 4 – Market Interpretation Summary

In a final Markdown cell, write a 2–3 paragraph statistical interpretation explaining your findings to a business stakeholder. Address the following items:

    What do your calculated coefficients suggest about how a video game's performance in one region relates to its global release performance?

    Why do you think the specific pairs you identified as the "strongest" and "weakest" behave the way they do? Consider regional gaming cultures, console platform preferences, or population scales in your reasoning.
