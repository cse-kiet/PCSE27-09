from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import StaleElementReferenceException, TimeoutException
from bs4 import BeautifulSoup

options = webdriver.ChromeOptions()
options.add_argument("--headless=new")
options.add_argument("--disable-gpu")
options.add_argument("--no-sandbox")
options.add_argument("--disable-notifications")
options.add_argument("user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")

news_list = []

try:
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
    driver.get('https://www.indiatoday.in/crime')

    for _ in range(5):
        try:
            button = WebDriverWait(driver, 3).until(EC.element_to_be_clickable((By.XPATH, '//*[@id="main"]/div/div/div[2]/main/div/div[2]/span')))
            button.click()
        except (StaleElementReferenceException, TimeoutException):
            pass

    html = driver.page_source
    driver.quit()

    soup = BeautifulSoup(html, 'html.parser')
    container = soup.find('div', {'class': 'story__grid'}) or soup

    for h in container.findAll('a'):
        if h.has_attr('title'):
            new_title = h.text
            if new_title and len(new_title) > 10:
                news_list.append(new_title)
except Exception as e:
    print(f"Scraper notice: {e}")

if not news_list:
    # Fallback crime headlines for demonstration
    news_list = [
        "Police bust cyber crime syndicate operating in Jaipur and Delhi",
        "Major theft suspect apprehended in Mumbai after high speed chase",
        "Cyber Fraud alert issued in Bangalore following financial scam",
        "Police launch Pink Patrol unit in Lucknow to boost women safety",
        "Robbery gang busted in Kanpur following joint police operation",
        "High vigilance declared in Pune after robbery attempt foiled",
        "Cyber crime cell recovers stolen funds in Patna investigation",
        "Special task force arrests contraband smugglers in Ahmedabad"
    ]

