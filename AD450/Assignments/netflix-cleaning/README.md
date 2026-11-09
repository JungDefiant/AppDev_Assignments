Tasks
Part 1 – Quantifying Missing Data

    Load the dataset into a Pandas DataFrame named netflix_titles. Display its initial shape.

    Missing Value Audit: Calculate the absolute number of missing data points per column using .isnull().sum().

    Impact Scaling: Calculate the percentage of missing data for each column. Write a brief Markdown comment explaining which columns suffer from the worst data gaps.

Part 2 – Cleaning Strategies (Dropping vs. Imputing)

Data analysts must choose between deleting missing records or filling them with placeholders. Run both tests below to compare the strategies:

    Strategy A (Imputation): The director column has numerous missing values. Programmatically replace all NaNvalues in the director column with the string placeholder "Unknown". Verify that the missing count for this column drops to 0.

    Strategy B (Row Dropping): Create a separate experimental DataFrame. Programmatically remove any rows where either the director or the cast columns contain missing data using .dropna().

    Reflection: Print the final shape of the DataFrame after running Strategy B. In a Markdown cell, calculate exactly how many rows of data were lost. Discuss a scenario where losing this much data could ruin an analysis.

Part 3 – Processing Datetime Data

    Data Type Verification: Check the data type of the date_added column using .dtypes. Notice that it is stored as a generic text string (object).

    Datetime Conversion: Convert the date_added column from a text string into a true data engineering datetime type using pd.to_datetime(). Verify the transformation using .info().

    Feature Extraction: Use the .dt accessor to extract the numeric day of the month from your new datetime column. Save these values into a new column in your DataFrame named day_added. Display the first 5 rows of your modified DataFrame to verify the change.
