const puppeteer = require('puppeteer');

  /**
 * 控制页面自动滚动
 * */
  const autoScroll = (page) => {
  return page.evaluate(() => {
    return new Promise(resolve => {
      let totalHeight = 0
      const distance = 100
      // 每200毫秒让页面下滑100像素的距离
      const timer = setInterval(() => {
        const scrollDiv = document.getElementsByClassName('activity-container')[0];
        const scrollHeight = scrollDiv.scrollHeight;
        scrollDiv.scrollBy(0, distance)
        totalHeight += distance
        if (totalHeight >= scrollHeight) {
          clearInterval(timer)
          resolve()
        }
      }, 200)
    })
  })
}


const getUrl = async () => {
  const brower = await puppeteer.launch();
  const page = await brower.newPage();

  // await page.setCookie({
  //   name: `vol`,
  //   domain: `https://console.volcengine.com`,
  //   url: `https://console.volcengine.com/datarangers/org/84/app/list`,
  //   value: `vcloudWebId=7959d7d7-be5e-4b82-b168-483c5f34e31e; login_scene=11; user=Rangers_6742031; MONITOR_WEB_ID=ef1299f1-fa92-4a89-9558-ef491698294a; __tea__ug__uid=9780101637835428408; _ga=GA1.2.380616827.1637835429; SameSite=None; top_region=; passport_csrf_token_default=7bffcbab50c578bd5040582b458f171f; passport_csrf_token=7bffcbab50c578bd5040582b458f171f; sid_guard=7e5e93e5348af371892d653304041c95%7C1638413800%7C5184000%7CMon%2C+31-Jan-2022+02%3A56%3A40+GMT; uid_tt=fc96dff535db26fe268386eaedb061e4; uid_tt_ss=fc96dff535db26fe268386eaedb061e4; sid_tt=7e5e93e5348af371892d653304041c95; sessionid=7e5e93e5348af371892d653304041c95; sessionid_ss=7e5e93e5348af371892d653304041c95; sid_ucp_v1=1.0.0-KDhiMjZiNDFlNDU0Yzg1MmJjMDEwMWM3MDZmMmE1NTRhOTMyZTkwNGQKFgiOk-Dr4owYEOjroI0GGLIQOAJA8QcaAmxmIiA3ZTVlOTNlNTM0OGFmMzcxODkyZDY1MzMwNDA0MWM5NQ; ssid_ucp_v1=1.0.0-KDhiMjZiNDFlNDU0Yzg1MmJjMDEwMWM3MDZmMmE1NTRhOTMyZTkwNGQKFgiOk-Dr4owYEOjroI0GGLIQOAJA8QcaAmxmIiA3ZTVlOTNlNTM0OGFmMzcxODkyZDY1MzMwNDA0MWM5NQ; n_mh=qMPI0U0q-lm1Xj4UD5bdaxeyAZy7LMIIZqHIhvQcYGo; ve_doc_history=6287,6315,4726,6285,6359,6360,6262,6367; s_v_web_id=2021122917062501020405722027009900; MONITOR_DEVICE_ID=684b0d8f-56e3-4381-a7aa-a63dd54b6756; _tea_utm_cache_173159=undefined; _tea_utm_cache_3569=undefined; _tea_utm_cache_3569=undefined; connect.sid=s%3Aa299d0d8-1e27-4921-a65c-08dc5a8f4747.E8BNftYvJGmXCDutsOlFCiohlmDhTEQymtCsZRxAgHs; digest=OhtwwnANvHJft9C1uqPbrntJ0aAZBUebCdhkDkgbXoM=; csrfToken=46b9df72c37a1898f28685ee37880615; __tea_cookie_tokens_3569=%257B%2522web_id%2522%253A%25227021814378296362528%2522%252C%2522ssid%2522%253A%252286af17a6-257a-4dc3-8797-34c6c4b18ee3%2522%252C%2522user_unique_id%2522%253A%25222100092055%2522%252C%2522timestamp%2522%253A1642150745694%257D`
  // });

  /* pdf中，px转inch */
  const convertPxToInches = (value) => {
    let inches = Math.ceil(value / 96 * 1000) / 1000;
    return `${parseFloat(inches).toFixed(3)}in`
  }

    /* 获取页面高度 */
  const realPageHeight = await page.evaluate(() => {
    const body = document.getElementsByClassName('activity-container')[0] || document.body,
    html = document.documentElement;
    const pageHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
    return pageHeight;
  })

  /* 获取页面宽度 */
  const realPageWidth = await page.evaluate(() => {
    const body = document.getElementsByClassName('activity-container')[0] || document.body,
    html = document.documentElement;
    const pageWidth = Math.max(body.scrollWidth, body.offsetWidth, html.clientWidth, html.scrollWidth, html.offsetWidth);
    return pageWidth;
  })

  const pageWidth = convertPxToInches(realPageWidth);
  const pageHeight = convertPxToInches(realPageHeight);


  const divHeight = await page.evaluate(() => {
    const divContainer = document.getElementsByClassName('activity-container')[0]
    const divContainerHeight = divContainer.scrollHeight;
    return divContainerHeight;
  })

  const divWidth = await page.evaluate(() => {
    const divContainer = document.getElementsByClassName('activity-container')[0]
    const divContainerWidth = divContainer.scrollWidth;
    return divContainerWidth;
  })



  await page.setViewport({
    width: divWidth + 100,
    height: divHeight + 100
  })
  await page.goto('https://chat.chengxinsong.cn/activity', {
    timeout: 600000,
    waitUntil: 'networkidle0', // networkidle2 会一直等待，直到页面加载后不存在 2 个以上的资源请求，这种状态持续至少 500 ms
  });

  await autoScroll(page)

  /* png图 */
  await page.screenshot({
    path: `happy_chat_${new Date().getTime()}.png`
  });

  // page.emulateMediaType('screen');
  // await page.pdf({
  //   height: pageHeight,
  //   width: pageHeight,
  //   path: `happy_chat_${new Date().getTime()}.pdf`,
  //   // format: 'a4'
  // })
  await brower.close();
}

getUrl();